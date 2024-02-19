import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { DeviceTokenRequest } from 'utils/generics/device-token.request';
@Injectable()
export class DeviceMemberService {
    constructor(private prismaService: PrismaService) {}

    async create(accountId: number, body: DeviceTokenRequest): Promise<void> {
        const device = await this.prismaService.device.findFirst({
            where: {
                accountId,
                token: body.deviceToken,
            },
            select: {
                id: true,
                isActive: true,
            },
        });
        if (device && !device.isActive) {
            await this.prismaService.device.update({
                where: {
                    id: device.id,
                },
                data: {
                    isActive: true,
                },
            });
        } else if (!device) {
            await this.prismaService.device.create({
                data: {
                    accountId,
                    token: body.deviceToken,
                },
            });
        }
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
