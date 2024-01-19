import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CodeAdminGetListRequest } from './request/code-admin-get-list.request';
import { CodeAdminUpsertRequest } from './request/code-admin-upsert.request';
import { CodeAdminGetDetailResponse } from './response/code-admin-get-detail.response';
import { CodeAdminGetListResponse } from './response/code-admin-get-list.response';

@Injectable()
export class CodeAdminService {
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
            ...QueryPagingHelper.queryPaging(query),
        });

        const codeListCount = await this.prismaService.code.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(codeList, new PageInfo(codeListCount));
    }

    async create(request: CodeAdminUpsertRequest): Promise<void> {
        await this.prismaService.code.create({
            data: {
                code: request.code,
                codeName: request.codeName,
                codeType: request.codeType,
            },
        });
    }

    async update(id: number, payload: CodeAdminUpsertRequest) {
        await this.prismaService.code.update({
            where: {
                id,
                isActive: true,
            },
            data: {
                code: payload.code,
                codeName: payload.codeName,
                codeType: payload.codeType,
            },
        });
    }

    async getDetail(id: number): Promise<CodeAdminGetDetailResponse> {
        return await this.prismaService.code.findUnique({
            where: {
                id,
                isActive: true,
            },
        });
    }

    async delete(ids: number[]) {
        await this.prismaService.code.deleteMany({
            where: {
                id: {
                    in: ids,
                },
                isActive: true,
            },
        });
    }
}
