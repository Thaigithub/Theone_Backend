import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyExchangeStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PointMemberCreateCurrencyExchangeRequest } from './request/point-member-create-currency-exchange.request';
import { PointMemberGetExchangePointListResponse } from './response/point-member-get-exchange-list.response';
import { PointMemberGetPointListResponse } from './response/point-member-get-list.response.ts';

@Injectable()
export class PointMemberService {
    constructor(private prismaService: PrismaService) {}

    async getPointList(accountId: number, query: PaginationRequest): Promise<PointMemberGetPointListResponse> {
        const points = await this.prismaService.point.findMany({
            where: {
                member: {
                    accountId: accountId,
                },
                isActive: true,
            },
            select: {
                createdAt: true,
                reasonEarn: true,
                amount: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const pointCount = await this.prismaService.point.count({
            where: {
                member: {
                    accountId: accountId,
                },
                isActive: true,
            },
        });
        return new PaginationResponse(points, new PageInfo(pointCount));
    }

    async getExchangePointList(accountId: number, query: PaginationRequest): Promise<PointMemberGetExchangePointListResponse> {
        const points = await this.prismaService.currencyExchange.findMany({
            where: {
                member: {
                    accountId: accountId,
                },
                isActive: true,
            },
            select: {
                createdAt: true,
                updatedAt: true,
                exchangeStatus: true,
                amount: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });

        const exchangeCount = await this.prismaService.currencyExchange.count({
            where: {
                member: {
                    accountId: accountId,
                },
                isActive: true,
            },
        });
        return new PaginationResponse(points, new PageInfo(exchangeCount));
    }

    async createCurrencyExchange(accountId: number, body: PointMemberCreateCurrencyExchangeRequest) {
        await this.prismaService.$transaction(async (prisma) => {
            const bankAccount = await prisma.bankAccount.findUnique({
                where: {
                    member: {
                        accountId: accountId,
                        isActive: true,
                    },
                    id: body.bankId,
                    accountNumber: body.bankAccountNumber,
                    isActive: true,
                },
            });
            if (!bankAccount) {
                throw new NotFoundException('The bank account is not found');
            }
            if (body.currencyExchangePoint <= 0) {
                throw new ForbiddenException(`The points are must be greater than zero`);
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
            if (member.totalPoint < body.currencyExchangePoint) {
                throw new ForbiddenException(`The points are not enough to exchange`);
            }

            // Update the points of member
            await prisma.member.update({
                where: {
                    accountId: accountId,
                    isActive: true,
                },
                data: {
                    totalPoint: member.totalPoint - body.currencyExchangePoint,
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
                    amount: body.currencyExchangePoint,
                    exchangeStatus: CurrencyExchangeStatus.REQUESTED,
                },
            });
        });
    }
}
