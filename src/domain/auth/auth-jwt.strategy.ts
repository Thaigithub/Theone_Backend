import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'app.config';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { PrismaService } from 'services/prisma/prisma.service';
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
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie, ExtractJwt.fromAuthHeaderAsBearerToken()]),
            secretOrKey: JWT_SECRET_KEY,
            ignoreExpiration: false,
            passReqToCallback: false,
        });
    }

    async validate(payload: AuthJwtPayload) {
        const accountId = UID.fromBase58(payload.sub.accountId).getLocalID();
        const payloadData = await this.verifyPayload(accountId);
        return payloadData;
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
}
