import { HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountType, OtpType, SignupMethodType } from '@prisma/client';
import { APPLE_OAUTH_RESTAPI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, KAKAO_VERIFY_URL, NAVER_VERIFY_URL } from 'app.config';
import Axios from 'axios';
import { compare } from 'bcrypt';
import { OtpService } from 'domain/otp/otp.service';
import { OAuth2Client } from 'google-auth-library';
import { JwksClient } from 'jwks-rsa';
import { PrismaService } from 'services/prisma/prisma.service';
import { DbType } from 'utils/constants/account.constant';
import { UID } from 'utils/uid-generator';
import { AuthJwtFakePayloadData, AuthJwtPayloadData } from '../auth-jwt.strategy';
import { AccountDTO } from './dto/auth-member-account.dto';
import { AuthMemberLoginRequest } from './request/auth-member-login-normal.request';
import { AuthMemberLoginSocialRequest } from './request/auth-member-login-social.request';
import { AuthMemberPasswordRequest } from './request/auth-member-otp-send-password.request';
import { AuthMemberUserIdRequest } from './request/auth-member-otp-send-username.request';
import { AuthMemberOtpVerifyRequest } from './request/auth-member-otp-verify.request';
import { AuthMemberLoginResponse } from './response/auth-member-login.response';
import { AuthMemberOtpSendResponse } from './response/auth-member-otp-send.response';
import { AuthMemberOtpVerifyResponse } from './response/auth-member-otp-verify.response';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
const appleClient = new JwksClient({
    jwksUri: APPLE_OAUTH_RESTAPI,
});

@Injectable()
export class MemberAuthService {
    private readonly logger = new Logger(MemberAuthService.name);
    constructor(
        private prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
    ) {}
    async sendOtp(request: AuthMemberUserIdRequest | AuthMemberPasswordRequest, ip: string): Promise<AuthMemberOtpSendResponse> {
        const passwordRequest = request as AuthMemberPasswordRequest;
        const member = await this.prismaService.member.findFirst({
            where: {
                name: request.name,
                contact: request.phoneNumber,
                account: {
                    type: AccountType.MEMBER,
                    isActive: true,
                    username: passwordRequest.username,
                },
            },
        });
        if (!member) {
            throw new NotFoundException(`Account not found `);
        }
        return await this.otpService.sendOtp({ email: null, phoneNumber: member.contact, type: OtpType.PHONE, ip: ip });
    }
    async verifyOtp(request: AuthMemberOtpVerifyRequest, ip: string): Promise<AuthMemberOtpVerifyResponse> {
        return await this.otpService.checkValidOtp(request, ip);
    }
    async login(loginData: AuthMemberLoginRequest): Promise<AuthMemberLoginResponse> {
        this.logger.log('Login account');
        const account = await this.prismaService.account.findUnique({
            where: {
                username: loginData.username,
                type: AccountType.MEMBER,
                member: {
                    signupMethod: SignupMethodType.GENERAL,
                },
                isActive: true,
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

    fakeUidAccount(accountId: number): string {
        return new UID(accountId, DbType.Account, 0).toString();
    }

    async verifyPayload(accountId: number): Promise<AuthJwtPayloadData> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
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

    signToken(payloadData: AuthJwtFakePayloadData): string {
        const payload = {
            sub: payloadData,
        };
        return this.jwtService.sign(payload);
    }

    async googleLogin(request: AuthMemberLoginSocialRequest): Promise<AuthMemberLoginResponse> {
        const payload = (
            await googleClient.verifyIdToken({
                idToken: request.idToken,
                audience: GOOGLE_CLIENT_ID,
            })
        ).getPayload();
        const profile = await this.prismaService.member.findUnique({
            where: {
                email: payload.email,
                signupMethod: SignupMethodType.GOOGLE,
                account: {
                    type: AccountType.MEMBER,
                    isActive: true,
                },
            },
            select: {
                account: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
        });
        if (!profile) throw new HttpException('Account not found', HttpStatus.OK);
        return this.loginSignupSocialFlow({
            id: profile.account.id,
            type: profile.account.type,
        });
    }

    async appleLogin(request: AuthMemberLoginSocialRequest): Promise<AuthMemberLoginResponse> {
        const json = this.jwtService.decode(request.idToken, { complete: true });
        const kid = json.header.kid;
        const applekey = (await appleClient.getSigningKey(kid)).getPublicKey();
        const payload = await this.jwtService.verify(applekey, json);
        const profile = await this.prismaService.member.findUnique({
            where: {
                email: payload.email,
                signupMethod: SignupMethodType.APPLE,
                account: {
                    type: AccountType.MEMBER,
                    isActive: true,
                },
            },
            select: {
                account: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
        });
        return this.loginSignupSocialFlow({
            id: profile.account.id,
            type: profile.account.type,
        });
    }

    async kakaoLogin(request: AuthMemberLoginSocialRequest): Promise<AuthMemberLoginResponse> {
        const payload = await Axios.post(KAKAO_VERIFY_URL, {
            headers: {
                Authorization: `Bearer ${request.idToken}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then((response) => response.data)['kakao_account'];
        const profile = await this.prismaService.member.findUnique({
            where: {
                email: payload.email,
                signupMethod: SignupMethodType.KAKAO,
                account: {
                    type: AccountType.MEMBER,
                    isActive: true,
                },
            },
            select: {
                account: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
        });
        return this.loginSignupSocialFlow({
            id: profile.account.id,
            type: profile.account.type,
        });
    }

    async naverLogin(request: AuthMemberLoginSocialRequest): Promise<AuthMemberLoginResponse> {
        const payload = await Axios.post(NAVER_VERIFY_URL, {
            headers: {
                Authorization: `Bearer ${request.idToken}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then((response) => response.data)['reponse'];
        const profile = await this.prismaService.member.findUnique({
            where: {
                email: payload.email,
                signupMethod: SignupMethodType.NAVER,
                account: {
                    type: AccountType.MEMBER,
                    isActive: true,
                },
            },
            select: {
                account: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
        });
        return this.loginSignupSocialFlow({
            id: profile.account.id,
            type: profile.account.type,
        });
    }

    async loginSignupSocialFlow(profile: AccountDTO): Promise<AuthMemberLoginResponse> {
        await this.prismaService.account.update({
            where: {
                id: profile.id,
            },
            data: {
                lastAccessAt: new Date(),
            },
        });
        const uid = this.fakeUidAccount(profile.id);
        const type = profile.type;
        const payload: AuthJwtFakePayloadData = {
            accountId: uid,
            type: type,
        };

        const token = this.signToken(payload);

        return { token, uid, type };
    }
}
