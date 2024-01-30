import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PointStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CurrencyExchangeAdminSearchCategoryFilter } from './dto/currency-exchange-admin-filter';
import { CurrencyExchangeAdminGetExchangeListRequest } from './request/currency-exchange-admin-get-list.request';
import { CurrencyExchangeAdminUpdateRequest } from './request/currency-exchange-admin-update.request';
import { CurrencyExchangeAdminGetListResponse } from './response/currency-exchange-admin-get-list.response';

@Injectable()
export class CurrencyExchangeAdminService {
    constructor(private prismaService: PrismaService) {}
    async getList(query: CurrencyExchangeAdminGetExchangeListRequest): Promise<CurrencyExchangeAdminGetListResponse> {
        const queryFilter: Prisma.CurrencyExchangeWhereInput = {
            isActive: true,
            ...(query.status && { status: query.status }),
            ...((query.startDate || query.endDate) && {
                status: PointStatus.APPROVED,
                updatedAt: {
                    gte: query.startDate ? new Date(query.startDate).toISOString() : undefined,
                    lte: query.endDate ? new Date(query.endDate).toISOString() : undefined,
                },
            }),
            member: {
                ...(query.category == CurrencyExchangeAdminSearchCategoryFilter.NAME && {
                    name: { contains: query.keyword, mode: 'insensitive' },
                }),
                ...(query.category == CurrencyExchangeAdminSearchCategoryFilter.CONTACT && {
                    contact: { contains: query.keyword, mode: 'insensitive' },
                }),
            },
        };
        const currencyExchanges = (
            await this.prismaService.currencyExchange.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    member: {
                        select: {
                            id: true,
                            name: true,
                            contact: true,
                            bankAccount: {
                                select: {
                                    bankName: true,
                                    accountNumber: true,
                                },
                            },
                        },
                    },
                    amount: true,
                    status: true,
                    updatedAt: true,
                },
                orderBy: {
                    updatedAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.member.name,
                contact: item.member.contact,
                amount: item.amount,
                status: item.status,
                completeDate: item.status === PointStatus.APPROVED ? item.updatedAt : null,
                bankName: item.member.bankAccount ? item.member.bankAccount.bankName : null,
                accountNumber: item.member.bankAccount ? item.member.bankAccount.accountNumber : null,
            };
        });

        const currencyExchangeCount = await this.prismaService.currencyExchange.count({
            where: queryFilter,
        });
        return new PaginationResponse(currencyExchanges, new PageInfo(currencyExchangeCount));
    }

    async update(id: number, body: CurrencyExchangeAdminUpdateRequest): Promise<void> {
        const currencyExchange = await this.prismaService.currencyExchange.findUnique({
            where: {
                id: id,
                isActive: true,
                member: {
                    isActive: true,
                },
            },
            select: {
                status: true,
                amount: true,
                memberId: true,
            },
        });
        if (!currencyExchange) {
            throw new NotFoundException(`The currency exchange request with id = ${id} is not exist`);
        }
        if (body.status === PointStatus.APPROVED && currencyExchange.status !== PointStatus.REQUESTING) {
            throw new BadRequestException('Invalid state transition request');
        } else if (body.status === PointStatus.REJECTED && (currencyExchange.status !== PointStatus.REQUESTING || !body.reason)) {
            throw new BadRequestException('Invalid state transition request');
        }
        if (currencyExchange.status === PointStatus.REQUESTING) {
            await this.prismaService.$transaction(async (prisma) => {
                await prisma.currencyExchange.update({
                    where: {
                        id: id,
                    },
                    data: {
                        status: body.status,
                        ...(body.status === PointStatus.REJECTED && {
                            reason: body.reason,
                        }),
                    },
                });
                if (body.status === PointStatus.REJECTED) {
                    await prisma.member.update({
                        where: {
                            id: currencyExchange.memberId,
                        },
                        data: {
                            totalPoint: { increment: currencyExchange.amount },
                        },
                    });
                }
            });
        }
    }
}
