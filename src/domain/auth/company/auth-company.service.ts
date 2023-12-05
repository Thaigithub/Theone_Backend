import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountType } from '@prisma/client';
import { APPLE_OAUTH_RESTAPI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, KAKAO_VERIFY_URL, NAVER_VERIFY_URL } from 'app.config';
import Axios from 'axios';
import { compare } from 'bcrypt';
import { OtpService } from 'domain/otp/otp.service';
import { OAuth2Client } from 'google-auth-library';
import { JwksClient } from 'jwks-rsa';
import { PrismaService } from 'services/prisma/prisma.service';
import { DbType } from 'utils/constants/account.constant';
import { UID } from 'utils/uid';
import { AuthJwtFakePayloadData, AuthJwtPayloadData } from '../auth-jwt.strategy';
import { AccountDTO } from './dto/auth-company-account.dto';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyLoginSocialRequest } from './request/auth-company-login-social.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
const appleClient = new JwksClient({
    jwksUri: APPLE_OAUTH_RESTAPI,
});

@Injectable()
export class AuthCompanyService {
    private readonly logger = new Logger(AuthCompanyService.name);
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

    async googleLogin(request: AuthCompanyLoginSocialRequest): Promise<AuthCompanyLoginResponse> {
        const payload = (
            await googleClient.verifyIdToken({
                idToken: request.idToken,
                audience: GOOGLE_CLIENT_ID,
            })
        ).getPayload();
        const profile = await this.prismaService.company.findUnique({
            where: {
                email: payload.email,
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

    async appleLogin(request: AuthCompanyLoginSocialRequest): Promise<AuthCompanyLoginResponse> {
        const json = this.jwtService.decode(request.idToken, { complete: true });
        const kid = json.header.kid;
        const applekey = (await appleClient.getSigningKey(kid)).getPublicKey();
        const payload = await this.jwtService.verify(applekey, json);
        const profile = await this.prismaService.company.findUnique({
            where: {
                email: payload.email,
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

    async kakaoLogin(request: AuthCompanyLoginSocialRequest): Promise<AuthCompanyLoginResponse> {
        const payload = await Axios.post(KAKAO_VERIFY_URL, {
            headers: {
                Authorization: `Bearer ${request.idToken}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then((response) => response.data)['kakao_account'];
        const profile = await this.prismaService.company.findUnique({
            where: {
                email: payload.email,
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

    async naverLogin(request: AuthCompanyLoginSocialRequest): Promise<AuthCompanyLoginResponse> {
        const payload = await Axios.post(NAVER_VERIFY_URL, {
            headers: {
                Authorization: `Bearer ${request.idToken}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then((response) => response.data)['reponse'];
        const profile = await this.prismaService.company.findUnique({
            where: {
                email: payload.email,
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

    async loginSignupSocialFlow(profile: AccountDTO): Promise<AuthCompanyLoginResponse> {
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
