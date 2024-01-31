import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeAdminGetListResponse } from '../admin/response/code-admin-get-list.response';

@Injectable()
export class CodeMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: CodeAdminGetListRequest): Promise<CodeAdminGetListResponse> {
        const queryFilter = {
            isActive: true,
        };

        const codeList = await this.prismaService.code.findMany({
            select: {
                id: true,
                code: true,
                name: true,
            },
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const codeListCount = await this.prismaService.code.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(codeList, new PageInfo(codeListCount));
    }
}
