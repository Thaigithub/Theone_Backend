import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'services/prisma/prisma.service';
import { AccountAdminUpdatePasswordRequest } from './request/account-admin-update-password.request';
import { AccountAdminGetDetailResponse } from './response/account-admin-get-detail.response';

@Injectable()
export class AccountAdminService {
    constructor(private prismaService: PrismaService) {}

    async getDetail(accountId: number): Promise<AccountAdminGetDetailResponse> {
        const admin = await this.prismaService.admin.findUnique({
            where: {
                accountId,
                isActive: true,
            },
            include: {
                permissions: {
                    include: {
                        function: true,
                    },
                },
            },
        });

        if (!admin) throw new NotFoundException('Admin not found');

        return {
            name: admin.name,
            level: admin.level,
            permissions: admin.permissions.map((item) => {
                return item.function.name;
            }),
        };
    }

    async updatePassword(accountId: number, body: AccountAdminUpdatePasswordRequest): Promise<void> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
            },
        });

        if (!account) throw new NotFoundException('Admin not found');

        const passwordMatch = await compare(body.currentPassword, account.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Password does not match');
        }

        await this.prismaService.account.update({
            where: {
                id: accountId,
            },
            data: {
                password: await hash(body.newPassword, 10),
            },
        });
    }
}
