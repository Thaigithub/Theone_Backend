import { JwtFakePayloadData, JwtPayloadData } from 'infrastructure/passport/strategies/jwt.strategy';
import { LoginRequest, SocialLoginRequest } from 'presentation/requests/login.request';
import { OtpVerificationRequest, PasswordSmsRequest, UserIdSmsRequest } from 'presentation/requests/user-info.request';
import { LoginResponse } from 'presentation/responses/login.response';
import { PasswordSmsResponse, UserIdSmsResponse } from 'presentation/responses/user-info.request';


export interface AuthUseCase {
  login(loginData: LoginRequest): Promise<LoginResponse>;
  verifyPayload(userId: number): Promise<JwtPayloadData>;
  signToken(payloadData: JwtFakePayloadData): string;
  googleLogin(request: SocialLoginRequest): Promise<LoginResponse>;
  appleLogin(request: SocialLoginRequest): Promise<LoginResponse>;
  kakaoLogin(request: SocialLoginRequest): Promise<LoginResponse>;
  naverLogin(request: SocialLoginRequest): Promise<LoginResponse>;
  sendOtp(otpRequest: UserIdSmsRequest | PasswordSmsRequest, isPasswordRequest: boolean): Promise<boolean>;
  verifyOtp(otpCode: OtpVerificationRequest, isPasswordRequest: boolean): Promise<UserIdSmsResponse | PasswordSmsResponse>;
}

export const AuthUseCase = Symbol('AuthUseCase');
