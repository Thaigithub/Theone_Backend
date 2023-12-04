import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'app.config';
import { AuthUseCase } from 'domain/auth/auth.use-case';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { UID } from 'utils/uid';

export interface AuthJwtFakePayloadData {
    accountId: string;
    type: string;
}

export interface AuthJwtPayloadData {
    accountId: number;
    type: string;
}

export interface AuthJwtPayload {
    sub: AuthJwtFakePayloadData;
    iat: number;
    exp: number;
}

const extractJwtFromCookie: JwtFromRequestFunction = (request) => {
    return request.signedCookies['token']!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
};

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@Inject(AuthUseCase) private readonly authUseCase: AuthUseCase) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie, ExtractJwt.fromAuthHeaderAsBearerToken()]),
            secretOrKey: JWT_SECRET_KEY,
            ignoreExpiration: false,
            passReqToCallback: false,
        });
    }

    async validate(payload: AuthJwtPayload) {
        const accountId = UID.fromBase58(payload.sub.accountId).getLocalID();
        const payloadData = await this.authUseCase.verifyPayload(accountId);
        return payloadData;
    }
}
