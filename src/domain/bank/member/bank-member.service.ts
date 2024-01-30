import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { BankMemberGetListResponse } from './response/bank-member-get-list.response';

@Injectable()
export class BankMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(): Promise<BankMemberGetListResponse[]> {
        return await this.prismaService.bank.findMany({
            select: {
                name: true,
            },
            where: {
                isActive: true,
            },
        });
    }
}
