import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TermMemberGetListRequest } from './request/term-member-get-list.request';
import { TermMemberGetListResponse } from './response/term-member-get-list.response';

@Injectable()
export class TermMemberService {
    constructor(private prismaService: PrismaService) {}

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
