import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyExchangeStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PointMemberStatus } from './enum/point-member-request-status.enum';
import { PointMemberCreateCurrencyExchangeRequest } from './request/point-member-create-currency-exchange.request';
import { PointMemberGetCountResponse } from './response/point-member-get-count.response';
import { PointMemberExchangeGetListResponse } from './response/point-member-get-exchange-list.response';
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

    async checkApplyApplication(accountId: number) {
        const member = await this.prismaService.member.findUnique({
            where: {
                accountId: accountId,
                isActive: true,
            },
            select: {
                applyPosts: true,
            },
        });
        if (!member) {
            throw new NotFoundException('The member id is not found');
        }
        if (!member.applyPosts || member.applyPosts.length < 1) {
            return false;
        }
        return true;
    }

    async getList(accountId: number, query: PaginationRequest): Promise<PointMemberGetListResponse> {
        if (!(await this.checkApplyApplication(accountId))) {
            return {
                status: PointMemberStatus.NOT_REQUESTED,
                data: null,
            };
        }
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
        return {
            status: PointMemberStatus.REQUESTED,
            data: new PaginationResponse(points, new PageInfo(pointCount)),
        };
    }

    async getExchangeList(accountId: number, query: PaginationRequest): Promise<PointMemberExchangeGetListResponse> {
        if (!(await this.checkApplyApplication(accountId))) {
            return {
                status: PointMemberStatus.NOT_REQUESTED,
                data: null,
            };
        }
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
        return {
            status: PointMemberStatus.NOT_REQUESTED,
            data: new PaginationResponse(points, new PageInfo(exchangeCount)),
        };
    }

    async createCurrencyExchange(accountId: number, body: PointMemberCreateCurrencyExchangeRequest) {
        if (!(await this.checkApplyApplication(accountId))) {
            throw new BadRequestException(`Member hasn't applied any post yet`);
        }
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
