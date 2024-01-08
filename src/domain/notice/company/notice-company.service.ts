import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { QueryPagingHelper } from '../../../utils/pagination-query';
import { CompanyGetNoticeResponse, NoticeCompanyGetListResponse } from './response/company-notice.response';

@Injectable()
export class NoticeCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: PaginationRequest, accountId: number): Promise<NoticeCompanyGetListResponse> {
        const queryFilter: Prisma.NoticeWhereInput = {
            account: {
                id: accountId,
                isActive: true,
            },
            isActive: true,
        };
        const notices = await this.prismaService.notice.findMany({
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const mappedResult = notices.map(
            (item) =>
                ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    type: item.type,
                }) as CompanyGetNoticeResponse,
        );
        const countNotice = await this.prismaService.notice.count({
            where: queryFilter,
        });

        return new PaginationResponse(mappedResult, new PageInfo(countNotice));
    }

    async delete(id: number, accountId: number): Promise<void> {
        const queryFilter: Prisma.NoticeWhereUniqueInput = {
            id: id,
            account: {
                id: accountId,
                isActive: true,
            },
            isActive: true,
        };
        const notice = await this.prismaService.notice.findUnique({
            where: queryFilter,
            select: {
                isActive: true,
            },
        });
        if (!notice) {
            throw new NotFoundException('The notice is not found');
        }
        await this.prismaService.notice.update({
            where: queryFilter,
            data: {
                isActive: false,
            },
        });
    }
}
