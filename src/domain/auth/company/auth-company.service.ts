import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountType, OtpType } from '@prisma/client';
import { compare } from 'bcrypt';
import { OtpService } from 'domain/otp/otp.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { DbType } from 'utils/constants/account.constant';
import { UID } from 'utils/uid-generator';
import { AuthJwtFakePayloadData, AuthJwtPayloadData } from '../auth-jwt.strategy';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyPasswordRequest } from './request/auth-company-otp-send-password.request';
import { AuthCompanyUserIdRequest } from './request/auth-company-otp-send-username.request';
import { AuthCompanyOtpVerifyRequest } from './request/auth-company-otp-verify.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
import { AuthCompanyOtpSendResponse } from './response/auth-company-otp-send.response';
import { AuthCompanyOtpVerifyResponse } from './response/auth-company-otp-verify.response';

@Injectable()
export class CompanyAuthService {
    private readonly logger = new Logger(CompanyAuthService.name);
    constructor(
        private prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
    ) {}

    async login(loginData: AuthCompanyLoginRequest): Promise<AuthCompanyLoginResponse> {
        this.logger.log('Login account');
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

    async sendOtp(
        request: AuthCompanyUserIdRequest | AuthCompanyPasswordRequest,
        ip: string,
    ): Promise<AuthCompanyOtpSendResponse> {
        const passwordRequest = request as AuthCompanyPasswordRequest;
        const company = await this.prismaService.company.findFirst({
            where: {
                name: request.name,
                email: request.email,
                account: {
                    type: AccountType.COMPANY,
                    isActive: true,
                    username: passwordRequest.username,
                },
            },
        });
        if (!company) {
            throw new NotFoundException(`Account not found `);
        }
        return await this.otpService.sendOtp({ email: company.email, phoneNumber: null, type: OtpType.PHONE, ip: ip });
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
