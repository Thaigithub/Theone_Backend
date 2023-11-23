<<<<<<< HEAD
import { JwtFakePayloadData, JwtPayloadData } from '../../infrastructure//passport/strategies/jwt.strategy';
import { LoginRequest } from '../../presentation/requests/login.request';
import { LoginResponse } from '../../presentation/responses/login.response';
=======
import { JwtFakePayloadData, JwtPayloadData } from 'infrastructure/passport/strategies/jwt.strategy';
import { LoginRequest } from 'presentation/requests/login.request';
import { LoginResponse } from 'presentation/responses/login.response';
>>>>>>> origin/develop

export interface AuthUseCase {
  login(loginData: LoginRequest): Promise<LoginResponse>;
  verifyPayload(userId: number): Promise<JwtPayloadData>;
  signToken(payloadData: JwtFakePayloadData): string;
  googleLogin(request:any):Promise<string>;
  kakaoLogin(request:any): Promise<string>;
}

export const AuthUseCase = Symbol('AuthUseCase');
