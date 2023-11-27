import { JwtFakePayloadData, JwtPayloadData } from 'infrastructure/passport/strategies/jwt.strategy';
import { LoginRequest } from 'presentation/requests/login.request';
import { OtpVerificationRequest, PasswordSmsRequest, UserIdSmsRequest } from 'presentation/requests/user-info.request';
import { LoginResponse } from 'presentation/responses/login.response';
import { PasswordSmsResponse, UserIdSmsResponse } from 'presentation/responses/user-info.request';

export interface AuthUseCase {
  login(loginData: LoginRequest): Promise<LoginResponse>;
  verifyPayload(userId: number): Promise<JwtPayloadData>;
  signToken(payloadData: JwtFakePayloadData): string;
  sendOtp(otpRequest: UserIdSmsRequest | PasswordSmsRequest, isPasswordRequest: boolean): Promise<boolean>;
  verifyOtp(otpCode: OtpVerificationRequest, isPasswordRequest: boolean): Promise<UserIdSmsResponse | PasswordSmsResponse>;
}

export const AuthUseCase = Symbol('AuthUseCase');
