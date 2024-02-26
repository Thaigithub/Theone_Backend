import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TermGuestGetListRequest } from './request/term-guest-get-list.request';
import { TermGuestGetListResponse } from './response/term-guest-get-list.response';

@Injectable()
export class TermGuestService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: TermGuestGetListRequest): Promise<TermGuestGetListResponse> {
        const search = {
            select: {
                title: true,
                terms: {
                    select: {
                        id: true,
                        content: true,
                        revisionDate: true,
                    },
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        revisionDate: Prisma.SortOrder.desc,
                    },
                    take: 1,
                },
            },
            where: {
                isActive: true,
                terms: {
                    some: {
                        isActive: true,
                    },
                },
            },
            orderBy: {
                createdAt: Prisma.SortOrder.asc,
            },
            ...QueryPagingHelper.queryPaging(query),
        };

        const terms = (await this.prismaService.term.findMany(search)).map((item) => {
            return {
                id: item.terms[0].id,
                title: item.title,
                content: item.terms[0].content,
                revisionDate: item.terms[0].revisionDate,
            };
        });
        const total = await this.prismaService.term.count({ where: search.where });

        return new PaginationResponse(terms, new PageInfo(total));
    }
}
