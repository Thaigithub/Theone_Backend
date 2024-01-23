import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { TermMemberGetListRequest } from './request/term-member-get-list.request';
import { TermMemberGetListResponse } from './response/term-member-get-list.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { Prisma } from '@prisma/client';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';

@Injectable()
export class TermMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: TermMemberGetListRequest): Promise<TermMemberGetListResponse> {
        const queryFilter: Prisma.TermWhereInput = {
            isActive: true,
        };
        const list = (
            await this.prismaService.term.findMany({
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                title: item.title,
                content: item.content,
            };
        });
        const total = await this.prismaService.term.count({
            where: queryFilter,
        });
        return new PaginationResponse(list, new PageInfo(total));
    }
}
