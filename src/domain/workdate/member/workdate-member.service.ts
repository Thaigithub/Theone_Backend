import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class WorkDateMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async getTotal(accountId: number): Promise<number> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                accountId,
            },
        });
        if (!memberExist) throw new NotFoundException('Member does not exist');
        return await this.prismaService.workDate.count({
            where: {
                labor: {
                    contract: {
                        application: {
                            member: {
                                accountId,
                            },
                        },
                    },
                },
            },
        });
    }
}
