import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { NoticeMemberUpdateRequest } from './request/notice-member-update-request';
import { NoticeMemberGetListResponse } from './response/notice-member-get-list.response';

@Injectable()
export class NoticeMemberService {
    constructor(private prismaService: PrismaService) {}
    async getList(accountId: number, query: PaginationRequest): Promise<NoticeMemberGetListResponse> {
        const queryFilter: Prisma.NoticeWhereInput = {
            account: {
                id: accountId,
                member: {
                    isActive: true,
                },
            },
            isActive: true,
        };
        const notices = await this.prismaService.notice.findMany({
            select: {
                id: true,
                createdAt: true,
                title: true,
                content: true,
                status: true,
            },
            where: queryFilter,
            orderBy: { createdAt: 'desc' },
            ...QueryPagingHelper.queryPaging(query),
        });
        const count = await this.prismaService.notice.count({
            where: queryFilter,
        });
        return new PaginationResponse(notices, new PageInfo(count));
    }

    async update(accountId: number, id: number, body: NoticeMemberUpdateRequest): Promise<void> {
        const queryFilter: Prisma.NoticeWhereUniqueInput = {
            id: id,
            isActive: true,
            account: {
                id: accountId,
                member: {
                    isActive: true,
                },
            },
        };
        const notice = await this.prismaService.notice.findUnique({
            where: queryFilter,
            select: {
                status: true,
            },
        });
        if (!notice) {
            throw new NotFoundException('The notice id is not exist');
        }
        if (notice.status !== body.status) {
            await this.prismaService.notice.update({
                where: queryFilter,
                data: {
                    status: body.status,
                },
            });
        }
    }

    async delete(accountId: number, id: number): Promise<void> {
        const notice = await this.prismaService.notice.findUnique({
            where: {
                id: id,
                isActive: true,
                account: {
                    id: accountId,
                    member: {
                        isActive: true,
                    },
                },
            },
        });
        if (!notice) {
            throw new NotFoundException('The notice id is not found');
        }
        await this.prismaService.notice.update({
            where: {
                id: notice.id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
