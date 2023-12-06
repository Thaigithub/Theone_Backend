import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountType } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'services/prisma/prisma.service';
import { DbType } from 'utils/constants/account.constant';
import { UID } from 'utils/uid';
import { AuthJwtFakePayloadData, AuthJwtPayloadData } from '../auth-jwt.strategy';
import { AuthAdminLoginRequest } from './request/auth-admin-login-normal.request';
import { AuthAdminLoginResponse } from './response/auth-admin-login.response';

@Injectable()
export class AuthAdminService {
    private readonly logger = new Logger(AuthAdminService.name);
    constructor(
        private prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}
    async login(loginData: AuthAdminLoginRequest): Promise<AuthAdminLoginResponse> {
        this.logger.log('Login account');
        const account = await this.prismaService.account.findUnique({
            where: {
                username: loginData.username,
                type: AccountType.ADMIN,
                isActive: true,
            },
        });

        if (!account) {
            throw new UnauthorizedException('Account not found');
        }

        const passwordMatch = await compare(loginData.password, account.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid username or password');
        }
        await this.prismaService.account.update({
            where: {
                username: loginData.username,
            },
            data: {
                lastAccessAt: new Date(),
            },
        });
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
                isActive: true,
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
}
