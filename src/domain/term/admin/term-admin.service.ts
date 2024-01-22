import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TermAdminGetListSearchCategory } from './enum/term-admin-get-list-search-category.enum';
import { TermAdminCreateRequest } from './request/term-admin-create.request';
import { TermAdminGetListRequest } from './request/term-admin-get-list.request';
import { TermAdminUpdateRequest } from './request/term-admin-update.request';
import { TermAdminGetDetailResponse } from './response/term-admin-get-detail.response';
import { TermAdminGetListResponse } from './response/term-admin-get-list.response';

@Injectable()
export class TermAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: TermAdminGetListRequest): Promise<TermAdminGetListResponse> {
        const queryFilter: Prisma.TermWhereInput = {
            isActive: true,
            ...(query.searchCategory === TermAdminGetListSearchCategory.TITLE && {
                title: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.searchCategory === TermAdminGetListSearchCategory.CONTENT && {
                content: { contains: query.keyword, mode: 'insensitive' },
            }),
        };

        const search = {
            select: {
                id: true,
                title: true,
                content: true,
            },
            where: queryFilter,
            ...QueryPagingHelper.queryPaging(query),
        };

        const terms = await this.prismaService.term.findMany(search);
        const total = await this.prismaService.term.count({ where: search.where });

        return new PaginationResponse(terms, new PageInfo(total));
    }

    async create(body: TermAdminCreateRequest): Promise<void> {
        await this.prismaService.term.create({
            data: {
                title: body.title,
                content: body.content,
            },
        });
    }

    async delete(id: number): Promise<void> {
        const term = await this.prismaService.term.count({
            where: {
                isActive: true,
                id,
            },
        });

        if (!term) throw new NotFoundException('Terms of service does not exist');

        await this.prismaService.term.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }

    async getDetail(id: number): Promise<TermAdminGetDetailResponse> {
        const term = await this.prismaService.term.findUnique({
            select: {
                id: true,
                title: true,
                content: true,
            },
            where: {
                id,
                isActive: true,
            },
        });

        if (!term) throw new NotFoundException('Terms of service does not exist');

        return term;
    }

    async update(id: number, body: TermAdminUpdateRequest): Promise<void> {
        const term = await this.prismaService.term.findUnique({
            where: {
                isActive: true,
                id,
            },
        });

        if (!term) throw new NotFoundException('Terms of service does not exist');

        await this.prismaService.term.update({
            where: {
                id,
            },
            data: {
                title: body.title,
                content: body.content,
            },
        });
    }
}
