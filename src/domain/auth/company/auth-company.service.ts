import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountType, OtpType } from '@prisma/client';
import { OTP_VERIFICATION_VALID_TIME } from 'app.config';
import { compare, hash } from 'bcrypt';
import { OtpService } from 'domain/otp/otp.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { DbType } from 'utils/constants/account.constant';
import { getTimeDifferenceInMinutes } from 'utils/time-calculator';
import { UID } from 'utils/uid-generator';
import { AuthJwtFakePayloadData, AuthJwtPayloadData } from '../auth-jwt.strategy';
import { AuthCompanyChangePasswordRequest } from './request/auth-company-change-password.request';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyPasswordRequest } from './request/auth-company-otp-send-password.request';
import { AuthCompanyUserIdRequest } from './request/auth-company-otp-send-username.request';
import { AuthCompanyOtpVerifyRequest } from './request/auth-company-otp-verify.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
import { AuthCompanyOtpSendResponse } from './response/auth-company-otp-send.response';
import { AuthCompanyOtpVerifyResponse } from './response/auth-company-otp-verify.response';

@Injectable()
export class CompanyAuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private otpService: OtpService,
    ) {}

    async login(loginData: AuthCompanyLoginRequest): Promise<AuthCompanyLoginResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                username: loginData.username,
                type: AccountType.COMPANY,
            },
        });

        if (!account) {
            throw new UnauthorizedException('Account not found');
        }

        const passwordMatch = await compare(loginData.password, account.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid username or password');
        }
        await this.prismaService.account.update({
            where: {
                username: loginData.username,
            },
            data: {
                lastAccessAt: new Date(),
            },
        });
        const uid = this.fakeUidAccount(account.id);
        const type = account.type;
        const payload: AuthJwtFakePayloadData = {
            accountId: uid,
            type,
        };

        const token = this.signToken(payload);

        return { token, uid, type };
    }

    async changePassword(body: AuthCompanyChangePasswordRequest, ip: string): Promise<void> {
        const searchOtp = await this.otpService.getOtp(body.otpId, ip);
        if (!searchOtp) throw new NotFoundException('Otp not found');
        if (getTimeDifferenceInMinutes(searchOtp.createdAt) > parseInt(OTP_VERIFICATION_VALID_TIME, 10)) {
            throw new BadRequestException('Otp verification is expired');
        }
        await this.otpService.usedOtp(searchOtp.id);
        await this.prismaService.account.update({
            where: {
                username: searchOtp.data,
            },
            data: {
                password: await hash(body.password, 10),
            },
        });
    }

    async sendOtp(
        request: AuthCompanyUserIdRequest | AuthCompanyPasswordRequest,
        ip: string,
    ): Promise<AuthCompanyOtpSendResponse> {
        const passwordRequest = request as AuthCompanyPasswordRequest;
        const company = await this.prismaService.company.findFirst({
            where: {
                name: request.name,
                phone: request.phoneNumber,
                account: {
                    type: AccountType.COMPANY,
                    isActive: true,
                    username: passwordRequest.username,
                },
            },
            select: {
                account: {
                    select: {
                        username: true,
                    },
                },
                phone: true,
            },
        });
        if (!company) {
            throw new NotFoundException(`Account not found `);
        }
        return await this.otpService.sendOtp({
            email: null,
            phoneNumber: company.phone,
            type: OtpType.PHONE,
            ip: ip,
            data: passwordRequest.username ? company.account.username : null,
        });
    }

    async verifyOtp(request: AuthCompanyOtpVerifyRequest, ip: string): Promise<AuthCompanyOtpVerifyResponse> {
        return await this.otpService.checkValidOtp(request, ip);
    }

    async verifyPayload(accountId: number): Promise<AuthJwtPayloadData> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
        });

        if (!account) {
            throw new UnauthorizedException('Account not found');
        }

        const payloadData: AuthJwtPayloadData = {
            accountId: account.id,
            type: account.type,
        };

        return payloadData;
    }

    fakeUidAccount(accountId: number): string {
        return new UID(accountId, DbType.Account, 0).toString();
    }

    signToken(payloadData: AuthJwtFakePayloadData): string {
        const payload = {
            sub: payloadData,
        };
        return this.jwtService.sign(payload);
    }
}
