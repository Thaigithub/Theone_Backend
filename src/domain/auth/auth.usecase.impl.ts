import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APPLE_OAUTH_RESTAPI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, KAKAO_VERIFY_URL, NAVER_VERIFY_URL } from 'app.config';
import Axios from 'axios';
import { compare } from 'bcrypt';
import { AccountRepository } from 'domain/account/account.repository';
import { fakeUidAccount } from 'domain/account/dto/account.dto';
import { AuthJwtFakePayloadData, AuthJwtPayloadData } from 'domain/auth/auth-jwt.strategy';
import { AuthUseCase } from 'domain/auth/auth.usecase';
import { LoginRequest, SocialLoginRequest } from 'domain/auth/request/auth-login.request';
import { OtpVerificationRequest, PasswordSmsRequest, UserIdSmsRequest } from 'domain/auth/request/auth-user-info.request';
import { AuthLoginResponse } from 'domain/auth/response/auth-login.response';
import { PasswordSmsResponse, UserIdSmsResponse } from 'domain/auth/response/auth-user-info.response';
import { CompanyRepository } from 'domain/company/company.repository';
import { CompanyDTO } from 'domain/company/dto/company.dto';
import { OtpProviderRepository } from 'domain/opt-provider/otp-provider.repository';
import { OAuth2Client } from 'google-auth-library';
import { JwksClient } from 'jwks-rsa';
import { OtpService } from 'services/sms/sms.service';
import { OTPGenerator } from 'utils/otp-generator';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
const appleClient = new JwksClient({
    jwksUri: APPLE_OAUTH_RESTAPI,
});

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {
    private readonly logger = new Logger(AuthUseCaseImpl.name);

    constructor(
        @Inject(AccountRepository) private readonly accountRepository: AccountRepository,
        @Inject(CompanyRepository) private readonly companyRepository: CompanyRepository,
        @Inject(OtpProviderRepository) private readonly otpProviderRepository: OtpProviderRepository,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
    ) {}
    async verifyOtp(
        otpCode: OtpVerificationRequest,
        isPasswordRequest: boolean,
    ): Promise<UserIdSmsResponse | PasswordSmsResponse> {
        this.logger.log('Verifying Otp request');
        const result = await this.otpProviderRepository.checkOtpValid(otpCode.phoneNumber, otpCode.code);
        if (!result) {
            throw new BadRequestException('Verify Otp failed');
        }
        const account = await this.otpProviderRepository.getAccountInfo(otpCode.phoneNumber);
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        const uid = fakeUidAccount(account.id);
        const userName = account.username;
        if (isPasswordRequest) {
            const passwordResponse: PasswordSmsResponse = {
                success: true,
                uid: uid,
            };
            return passwordResponse;
        } else {
            const userIdResponse: UserIdSmsResponse = {
                userName: userName,
                uid: uid,
            };
            return userIdResponse;
        }
    }

    async sendOtp(otpRequest: UserIdSmsRequest | PasswordSmsRequest, isPasswordRequest: boolean): Promise<boolean> {
        this.logger.log('Sending Otp Request');
        const userName = isPasswordRequest ? (otpRequest as PasswordSmsRequest).username : null;
        const otpProvider = await this.otpProviderRepository.findOne(otpRequest.name, otpRequest.phoneNumber, userName);
        if (!otpProvider) {
            throw new NotFoundException('OtpProvider not found');
        }
        const otp = OTPGenerator.generateOTPString();
        const result = await this.otpService.sendOTPSMS(otpRequest.phoneNumber, otp);
        if (!result) {
            throw new BadRequestException('Sending Otp failed');
        }
        this.otpProviderRepository.update(otpProvider.id, { otpCode: otp });
        return true;
    }

    async login(loginData: LoginRequest): Promise<AuthLoginResponse> {
        this.logger.log('Login account');
        const account = await this.accountRepository.findByUsername(loginData.username);

        if (!account) {
            throw new UnauthorizedException('Account not found');
        }

        const passwordMatch = await compare(loginData.password, account.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const uid = fakeUidAccount(account.id);
        const type = account.type;
        const payload: AuthJwtFakePayloadData = {
            accountId: uid,
            type,
        };

        const token = this.signToken(payload);

        return { token, uid, type };
    }

    async verifyPayload(accountId: number): Promise<AuthJwtPayloadData> {
        const account = await this.accountRepository.findOne(accountId);

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

    async googleLogin(request: SocialLoginRequest): Promise<AuthLoginResponse> {
        try {
            const payload = (
                await googleClient.verifyIdToken({
                    idToken: request.idToken,
                    audience: GOOGLE_CLIENT_ID,
                })
            ).getPayload();
            let profile = null;
            if (request.isMember) {
            } else {
                profile = await this.companyRepository.findByEmail(payload.email);
            }
            return this.loginSignupSocialFlow(profile);
        } catch (error) {
            console.log(error);
        }
    }

    async appleLogin(request: SocialLoginRequest): Promise<AuthLoginResponse> {
        const json = this.jwtService.decode(request.idToken, { complete: true });
        const kid = json.header.kid;
        const applekey = (await appleClient.getSigningKey(kid)).getPublicKey();
        const payload = await this.jwtService.verify(applekey, json);
        let profile = null;
        if (request.isMember) {
            // const account = await this.memberRepository.findByUsername(loginData.username);
        } else {
            profile = await this.companyRepository.findByEmail(payload.email);
        }
        return this.loginSignupSocialFlow(profile);
    }

    async kakaoLogin(request: SocialLoginRequest): Promise<AuthLoginResponse> {
        const payload = await Axios.post(KAKAO_VERIFY_URL, {
            headers: {
                Authorization: `Bearer ${request.idToken}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then((response) => response.data)['kakao_account'];
        let profile = null;
        if (request.isMember) {
            // const account = await this.memberRepository.findByUsername(loginData.username);
        } else {
            profile = await this.companyRepository.findByEmail(payload.email);
        }
        return this.loginSignupSocialFlow(profile);
    }

    async naverLogin(request: SocialLoginRequest): Promise<AuthLoginResponse> {
        const payload = await Axios.post(NAVER_VERIFY_URL, {
            headers: {
                Authorization: `Bearer ${request.idToken}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then((response) => response.data)['reponse'];
        let profile = null;
        if (request.isMember) {
            // const account = await this.memberRepository.findByUsername(loginData.username);
        } else {
            profile = await this.companyRepository.findByEmail(payload.email);
        }
        return this.loginSignupSocialFlow(profile);
    }

    async loginSignupSocialFlow(profile: CompanyDTO): Promise<AuthLoginResponse> {
        const uid = fakeUidAccount(profile.id);
        const type = (await this.accountRepository.findOne(profile.id)).type;
        const payload: AuthJwtFakePayloadData = {
            accountId: uid,
            type: type,
        };

        const token = this.signToken(payload);

        return { token, uid, type };
    }
}
