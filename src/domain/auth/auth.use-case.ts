import { AuthJwtFakePayloadData, AuthJwtPayloadData } from 'domain/auth/auth-jwt.strategy';
import { LoginRequest, SocialLoginRequest } from 'domain/auth/request/auth-login.request';
import { OtpVerificationRequest, PasswordSmsRequest, UserIdSmsRequest } from 'domain/auth/request/auth-user-info.request';
import { AuthLoginResponse } from 'domain/auth/response/auth-login.response';
import { PasswordSmsResponse, UserIdSmsResponse } from 'domain/auth/response/auth-user-info.response';

export interface AuthUseCase {
    login(loginData: LoginRequest): Promise<AuthLoginResponse>;
    verifyPayload(userId: number): Promise<AuthJwtPayloadData>;
    signToken(payloadData: AuthJwtFakePayloadData): string;
    googleLogin(request: SocialLoginRequest): Promise<AuthLoginResponse>;
    appleLogin(request: SocialLoginRequest): Promise<AuthLoginResponse>;
    kakaoLogin(request: SocialLoginRequest): Promise<AuthLoginResponse>;
    naverLogin(request: SocialLoginRequest): Promise<AuthLoginResponse>;
    sendOtp(otpRequest: UserIdSmsRequest | PasswordSmsRequest, isPasswordRequest: boolean): Promise<boolean>;
    verifyOtp(otpCode: OtpVerificationRequest, isPasswordRequest: boolean): Promise<UserIdSmsResponse | PasswordSmsResponse>;
}

export const AuthUseCase = Symbol('AuthUseCase');
