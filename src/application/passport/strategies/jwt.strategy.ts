import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'app.config';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { UID } from 'common/utils/uid';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';

export interface JwtFakePayloadData {
  userId: string;
  type: string;
}

export interface JwtPayloadData {
  userId: number;
  type: string;
}

export interface JwtPayload {
  sub: JwtFakePayloadData;
  iat: number;
  exp: number;
}

const extractJwtFromCookie: JwtFromRequestFunction = request => {
  return request.signedCookies['token']!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      secretOrKey: JWT_SECRET_KEY,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = UID.fromBase58(payload.sub.userId).getLocalID();
    const payloadData = await this.authUseCase.verifyPayload(userId);
    return payloadData;
  }
}
