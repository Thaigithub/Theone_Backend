import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { DeviceTokenRequest } from 'utils/generics/device-token.request';
@Injectable()
export class DeviceMemberService {
    constructor(private prismaService: PrismaService) {}

    async create(accountId: number, body: DeviceTokenRequest): Promise<void> {
        await this.prismaService.device.upsert({
            where: {
                token_accountId: {
                    accountId,
                    token: body.deviceToken,
                },
                account: {
                    isActive: true,
                    OR: [
                        { member: { isActive: true }, company: null },
                        { company: { isActive: true }, member: null },
                    ],
                },
            },
            create: {
                accountId,
                token: body.deviceToken,
            },
            update: {
                isActive: true,
                updatedAt: new Date(),
            },
        });
    }

    async delete(accountId: number, body: DeviceTokenRequest): Promise<void> {
        const device = await this.prismaService.device.findUnique({
            where: {
                token_accountId: {
                    accountId,
                    token: body.deviceToken,
                },
            },
            select: {
                id: true,
                isActive: true,
            },
        });
        if (device && device.isActive) {
            await this.prismaService.device.update({
                where: {
                    id: device.id,
                },
                data: {
                    isActive: false,
                },
            });
        }
    }
}
