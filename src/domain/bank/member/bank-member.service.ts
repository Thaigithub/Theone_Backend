import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { BankMemberGetListResponse } from './response/bank-member-get-list.response';

@Injectable()
export class BankMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(): Promise<BankMemberGetListResponse> {
        const banks = await this.prismaService.bank.findMany({
            select: {
                name: true,
            },
            where: {
                isActive: true,
            },
        });
        return new PaginationResponse(banks, new PageInfo(banks.length));
    }
}
