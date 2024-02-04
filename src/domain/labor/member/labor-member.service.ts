import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { LaborMemberGetTotalWorkDateResponse } from './response/labor-member-get-total-workdate.response';
import { Error } from 'utils/error.enum';

@Injectable()
export class LaborMemberService {
    constructor(private prismaService: PrismaService) {}

    async getTotalWorkDate(accountId: number): Promise<LaborMemberGetTotalWorkDateResponse> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                accountId,
            },
        });
        if (!memberExist) throw new NotFoundException(Error.MEMBER_NOT_FOUND);
        return {
            total: await this.prismaService.workDate.count({
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
            }),
        };
    }
}
