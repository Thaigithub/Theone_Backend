import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PointStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PointMemberCreateCurrencyExchangeRequest } from './request/point-member-create-currency-exchange.request';
import { PointMemberCreateRequest } from './request/point-member-create-point.request';
import { PointMemberGetListRequest } from './request/point-member-get-list.request';
import { PointMemberGetCountResponse } from './response/point-member-get-count.response';
import { PointMemberGetListResponse } from './response/point-member-get-list.response.ts';

@Injectable()
export class PointMemberService {
    constructor(private prismaService: PrismaService) {}

    async getCount(accountId: number): Promise<PointMemberGetCountResponse> {
        const points = await this.prismaService.member.findUnique({
            where: {
                accountId: accountId,
                isActive: true,
            },
            select: {
                totalPoint: true,
            },
        });
        if (!points) {
            throw new NotFoundException('The member id not exist');
        }
        return {
            count: points.totalPoint,
        };
    }

    async getList(accountId: number, query: PointMemberGetListRequest): Promise<PointMemberGetListResponse> {
        const queryFilter: Prisma.PointWhereInput = {
            member: {
                accountId: accountId,
            },
            isActive: true,
            ...(query.status && { status: query.status }),
        };

        const points = (
            await this.prismaService.point.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    reason: true,
                    amount: true,
                    status: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                createdAt: item.createdAt,
                completeAt: item.status == PointStatus.APPROVED ? item.updatedAt : null,
                reason: item.status !== PointStatus.REQUESTING ? item.reason : null,
                amount: item.amount,
                status: item.status,
            };
        });
        const count = await this.prismaService.point.count({
            where: queryFilter,
        });
        return new PaginationResponse(points, new PageInfo(count));
    }

    async getExchangeList(accountId: number, query: PaginationRequest): Promise<PointMemberGetListResponse> {
        const currentcyExchanges = (
            await this.prismaService.currencyExchange.findMany({
                where: {
                    member: {
                        accountId: accountId,
                    },
                    isActive: true,
                },
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    reason: true,
                    status: true,
                    amount: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                createdAt: item.createdAt,
                completeAt: item.status == PointStatus.APPROVED ? item.updatedAt : null,
                reason: item.status !== PointStatus.REQUESTING ? item.reason : null,
                amount: item.amount,
                status: item.status,
            };
        });

        const count = await this.prismaService.currencyExchange.count({
            where: {
                member: {
                    accountId: accountId,
                },
                isActive: true,
            },
        });
        return new PaginationResponse(currentcyExchanges, new PageInfo(count));
    }

    async createPointHistory(accountId: number, body: PointMemberCreateRequest): Promise<void> {
        const member = await this.prismaService.member.findUnique({
            where: {
                accountId: accountId,
                isActive: true,
            },
            select: {
                id: true,
            },
        });
        await this.prismaService.point.create({
            data: {
                file: {
                    create: {
                        fileName: body.file.fileName,
                        type: body.file.type,
                        size: body.file.size,
                        key: body.file.key,
                    },
                },
                status: PointStatus.REQUESTING,
                member: {
                    connect: { id: member.id },
                },
            },
        });
    }

    async createCurrencyExchange(accountId: number, body: PointMemberCreateCurrencyExchangeRequest) {
        await this.prismaService.$transaction(async (prisma) => {
            const bankAccount = await prisma.bankAccount.findFirst({
                where: {
                    member: {
                        accountId: accountId,
                        isActive: true,
                    },
                    isActive: true,
                },
            });
            if (!bankAccount) {
                throw new NotFoundException('The bank account is not found');
            }

            // Check if member is have enough points
            const member = await prisma.member.findUnique({
                where: {
                    accountId: accountId,
                    isActive: true,
                },
                select: {
                    totalPoint: true,
                },
            });
            if (member.totalPoint < body.amount) {
                throw new ForbiddenException(`The points are not enough to exchange`);
            }

            // Update the points of member
            await prisma.member.update({
                where: {
                    accountId: accountId,
                    isActive: true,
                },
                data: {
                    totalPoint: { decrement: body.amount },
                },
            });

            // create new currency exchange record
            await prisma.currencyExchange.create({
                data: {
                    member: {
                        connect: {
                            accountId: accountId,
                        },
                    },
                    amount: body.amount,
                    status: PointStatus.REQUESTING,
                },
            });
        });
    }
}
