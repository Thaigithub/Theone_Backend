import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeMemberGetListResponse } from './response/code-member-get-list.response';

@Injectable()
export class CodeMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: CodeAdminGetListRequest): Promise<CodeMemberGetListResponse> {
        const queryFilter = {
            isActive: true,
        };

        const codeList = (
            await this.prismaService.code.findMany({
                select: {
                    id: true,
                    name: true,
                },
                where: queryFilter,
                orderBy: {
                    createdAt: 'desc',
                },
                // Pagination
                // If both pageNumber and pageSize is provided then handle the pagination
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((ỉtem) => {
            return {
                codeName: ỉtem.name,
                id: ỉtem.id,
            };
        });

        const codeListCount = await this.prismaService.code.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(codeList, new PageInfo(codeListCount));
    }
}
