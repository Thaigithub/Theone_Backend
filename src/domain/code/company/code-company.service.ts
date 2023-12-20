import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CodeType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CodeAdminFilter } from '../admin/dto/code-admin-filter.enum';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeAdminGetListResponse } from '../admin/response/code-admin-get-list.response';

@Injectable()
export class CodeCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: CodeAdminGetListRequest): Promise<CodeAdminGetListResponse> {
        const queryFilter = {
            isActive: true,
            ...(query.codeType !== CodeAdminFilter.ALL && { codeType: CodeType[query.codeType] }),
        };

        try {
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
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
