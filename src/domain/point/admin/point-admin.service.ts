import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PointAdminSearchCategoryFilter, PointAdminSortCategoryFilter } from './dto/point-admin-filter';
import { PointAdminGetListRequest } from './request/point-admin-get-list.request';
import { PointAdminGetDetailResponse } from './response/point-admin-get-detail.response';
import { PointAdminGetListResponse } from './response/point-admin-get-list.response';
import { PointAdminGetMemberListResponse } from './response/point-admin-get-member-list.response';

@Injectable()
export class PointAdminService {
    constructor(private prismaService: PrismaService) {}

    async getMemberList(query: PointAdminGetListRequest): Promise<PointAdminGetMemberListResponse> {
        const queryFilter: Prisma.MemberWhereInput = {
            isActive: true,
            ...(query.searchCategory == PointAdminSearchCategoryFilter.NAME && {
                name: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == PointAdminSearchCategoryFilter.CONTACT && {
                contact: { contains: query.searchTerm, mode: 'insensitive' },
            }),
        };
        const members = await this.prismaService.member.findMany({
            where: queryFilter,
            select: {
                id: true,
                name: true,
                contact: true,
                totalPoint: true,
                currencyExchange: {
                    select: {
                        amount: true,
                    },
                    where: {
                        isActive: true,
                    },
                },
            },
            orderBy: {
                ...(query.pointHeld && query.pointHeld == PointAdminSortCategoryFilter.HIGH_TO_LOW && { totalPoint: 'desc' }),
                ...(query.pointHeld && query.pointHeld == PointAdminSortCategoryFilter.LOW_TO_HIGH && { totalPoint: 'asc' }),
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const results = members.map((item) => {
            const totalExchange = item.currencyExchange.reduce((sum, current) => sum + current.amount, 0);
            return {
                memberId: item.id,
                name: item.name,
                contact: item.contact,
                pointHeld: item.totalPoint,
                totalExchanngePoint: totalExchange,
            };
        });

        const memberCount = await this.prismaService.member.count({
            where: queryFilter,
        });
        return new PaginationResponse(results, new PageInfo(memberCount));
    }

    async calculateExchange(memberId: number) {
        const member = await this.prismaService.member.findFirst({
            where: {
                id: memberId,
                isActive: true,
            },
            select: {
                currencyExchange: {
                    select: {
                        amount: true,
                    },
                    where: {
                        isActive: true,
                    },
                },
            },
        });
        if (!member) {
            throw new NotFoundException('The id is not exist');
        }
        return member.currencyExchange.reduce((sum, current) => sum + current.amount, 0);
    }

    async getList(memberId: number, query: PaginationRequest): Promise<PointAdminGetListResponse> {
        const points = await this.prismaService.point.findMany({
            where: {
                memberId: memberId,
                isActive: true,
            },
            select: {
                createdAt: true,
                reasonEarn: true,
                amount: true,
                remainAmount: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const countPoint = await this.prismaService.point.count({
            where: {
                memberId: memberId,
                isActive: true,
            },
        });
        const results = points.map((item) => {
            return {
                createAt: item.createdAt,
                reasonEarn: item.reasonEarn,
                amount: item.amount,
                remainAmount: item.remainAmount,
            };
        });
        return new PaginationResponse(results, new PageInfo(countPoint));
    }

    async getDetail(memberId: number): Promise<PointAdminGetDetailResponse> {
        const member = await this.prismaService.member.findUnique({
            where: {
                id: memberId,
                isActive: true,
            },
            select: {
                name: true,
                contact: true,
                totalPoint: true,
            },
        });
        if (!member) {
            throw new NotFoundException('The id is not exist');
        }
        const totalExchangePoint = await this.calculateExchange(memberId);
        return {
            name: member.name,
            contact: member.contact,
            totalPoint: member.totalPoint,
            totalExchangePoint: totalExchangePoint,
        } as PointAdminGetDetailResponse;
    }
}
