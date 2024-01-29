import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
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
}
