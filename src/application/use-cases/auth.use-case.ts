import { JwtFakePayloadData, JwtPayloadData } from 'infrastructure/passport/strategies/jwt.strategy';
import { LoginRequest } from 'presentation/requests/login.request';
import { LoginResponse } from 'presentation/responses/login.response';

export interface AuthUseCase {
  login(loginData: LoginRequest): Promise<LoginResponse>;
  verifyPayload(userId: number): Promise<JwtPayloadData>;
  signToken(payloadData: JwtFakePayloadData): string;
  googleLogin(request:any): Promise<LoginResponse>;
  appleLogin(request:any): Promise<LoginResponse>;
  kakaoLogin(request:any): Promise<LoginResponse>;
  naverLogin(request:any): Promise<LoginResponse>;
}

export const AuthUseCase = Symbol('AuthUseCase');
