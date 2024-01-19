import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeAdminGetListResponse } from '../admin/response/code-admin-get-list.response';

@Injectable()
export class CodeCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: CodeAdminGetListRequest): Promise<CodeAdminGetListResponse> {
        const queryFilter = {
            isActive: true,
            ...(query.codeType && { codeType: query.codeType }),
        };

        const codeList = await this.prismaService.code.findMany({
            select: {
                id: true,
                code: true,
                codeName: true,
                codeType: true,
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