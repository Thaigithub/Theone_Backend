import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CodeType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CodeAdminFilter } from './dto/code-admin-filter.enum';
import { CodeAdminGetListRequest } from './request/code-admin-get-list.request';
import { CodeAdminUpsertRequest } from './request/code-admin-upsert.request';
import { CodeAdminGetItemResponse } from './response/code-admin-get-item.response';
import { CodeAdminGetListResponse } from './response/code-admin-get-list.response';

@Injectable()
export class CodeAdminService {
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

            return new CodeAdminGetListResponse(codeList, codeListCount);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
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

    async changeCodeInfo(id: number, payload: CodeAdminUpsertRequest) {
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

    async getCodeDetail(id: number): Promise<CodeAdminGetItemResponse> {
        return await this.prismaService.code.findUnique({
            where: {
                id,
                isActive: true,
            },
        });
    }

    async deleteCode(id: number) {
        await this.prismaService.code.delete({
            where: {
                id,
                isActive: true,
            },
        });
    }
}
