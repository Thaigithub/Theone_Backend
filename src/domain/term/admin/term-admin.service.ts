import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TermAdminGetListCategory } from './enum/term-admin-get-list-category.enum';
import { TermAdminCreateRequest } from './request/term-admin-create.request';
import { TermAdminGetListRequest } from './request/term-admin-get-list.request';
import { TermAdminUpdateRequest } from './request/term-admin-update.request';
import { TermAdminGetDetailResponse } from './response/term-admin-get-detail.response';
import { TermAdminGetListResponse } from './response/term-admin-get-list.response';

@Injectable()
export class TermAdminService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: TermAdminGetListRequest): Promise<TermAdminGetListResponse> {
        const queryFilter: Prisma.TermVersionWhereInput = {
            isActive: true,
            ...(query.searchCategory === TermAdminGetListCategory.TITLE && {
                term: {
                    title: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
            ...(query.searchCategory === TermAdminGetListCategory.CONTENT && {
                content: { contains: query.keyword, mode: 'insensitive' },
            }),
        };

        const search = {
            select: {
                id: true,
                content: true,
                revisionDate: true,
                term: {
                    select: {
                        title: true,
                    },
                },
            },
            where: queryFilter,
            orderBy: [
                {
                    term: {
                        updatedAt: Prisma.SortOrder.desc,
                    },
                },
                { revisionDate: Prisma.SortOrder.desc },
            ],
            ...QueryPagingHelper.queryPaging(query),
        };

        const terms = (await this.prismaService.termVersion.findMany(search)).map((item) => {
            return {
                id: item.id,
                title: item.term.title,
                content: item.content,
                revisionDate: item.revisionDate,
            };
        });
        const total = await this.prismaService.termVersion.count({ where: search.where });

        return new PaginationResponse(terms, new PageInfo(total));
    }

    async create(body: TermAdminCreateRequest): Promise<void> {
        await this.prismaService.term.create({
            data: {
                title: body.title,
                terms: {
                    create: {
                        content: body.content,
                        revisionDate: new Date(body.revisionDate),
                    },
                },
            },
        });
    }

    async delete(id: number): Promise<void> {
        const term = await this.prismaService.termVersion.count({
            where: {
                isActive: true,
                id,
            },
        });

        if (!term) throw new NotFoundException(Error.TERM_NOT_FOUND);

        await this.prismaService.termVersion.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }

    async getDetail(id: number): Promise<TermAdminGetDetailResponse> {
        const term = await this.prismaService.termVersion.findUnique({
            select: {
                id: true,
                content: true,
                term: {
                    select: {
                        title: true,
                    },
                },
                revisionDate: true,
            },
            where: {
                id,
                isActive: true,
            },
        });

        if (!term) throw new NotFoundException(Error.TERM_NOT_FOUND);

        return {
            id: term.id,
            title: term.term.title,
            content: term.content,
            revisionDate: term.revisionDate,
        };
    }

    async update(id: number, body: TermAdminUpdateRequest): Promise<void> {
        const term = await this.prismaService.termVersion.findUnique({
            where: {
                isActive: true,
                id,
            },
        });

        if (!term) throw new NotFoundException(Error.TERM_NOT_FOUND);

        await this.prismaService.termVersion.create({
            data: {
                content: body.content,
                revisionDate: new Date(body.revisionDate),
                term: {
                    connect: {
                        id: term.termId,
                    },
                },
            },
        });

        await this.prismaService.termVersion.update({
            where: {
                id,
            },
            data: {
                term: {
                    update: {
                        title: body.title,
                    },
                },
            },
        });
    }
}
