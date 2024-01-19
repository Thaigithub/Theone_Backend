import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyExchangeStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CurrencyExchangeAdminSearchCategoryFilter } from './dto/currency-exchange-admin-filter';
import { CurrencyExchangeAdminGetExchangeListRequest } from './request/currency-exchange-admin-get-list.request';
import { CurrencyExchangeAdminGetListResponse } from './response/currency-exchange-admin-get-list.response';

@Injectable()
export class CurrencyExchangeAdminService {
    constructor(private prismaService: PrismaService) {}
    async getList(query: CurrencyExchangeAdminGetExchangeListRequest): Promise<CurrencyExchangeAdminGetListResponse> {
        const queryFilter: Prisma.CurrencyExchangeWhereInput = {
            isActive: true,
            ...(query.refundStatus && { exchangeStatus: query.refundStatus }),
            updatedAt: {
                gte: query.startDate ? new Date(query.endDate).toISOString() : undefined,
                lte: query.endDate ? new Date(query.endDate).toISOString() : undefined,
            },
            createdAt: {
                gte: query.startDate ? new Date(query.endDate).toISOString() : undefined,
                lte: query.endDate ? new Date(query.endDate).toISOString() : undefined,
            },
            ...(query.searchCategory == CurrencyExchangeAdminSearchCategoryFilter.NAME && {
                name: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == CurrencyExchangeAdminSearchCategoryFilter.CONTACT && {
                contact: { contains: query.searchTerm, mode: 'insensitive' },
            }),
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
                    exchangeStatus: true,
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
                memberId: item.member.id,
                name: item.member.name,
                contact: item.member.contact,
                amount: item.amount,
                exchangeStatus: item.exchangeStatus,
                updatedAt: item.updatedAt,
                bankName: item.member.bankAccount ? item.member.bankAccount.bankName : null,
                accountNumber: item.member.bankAccount ? item.member.bankAccount.accountNumber : null,
            };
        });

        const currencyExchangeCount = await this.prismaService.currencyExchange.count({
            where: queryFilter,
        });
        return new PaginationResponse(currencyExchanges, new PageInfo(currencyExchangeCount));
    }

    async getCurrencyExchange(id: number) {
        const currencyExchange = await this.prismaService.currencyExchange.findUnique({
            where: {
                id: id,
                isActive: true,
                member: {
                    isActive: true,
                },
            },
            select: {
                memberId: true,
                exchangeStatus: true,
                amount: true,
            },
        });
        if (!currencyExchange) {
            throw new NotFoundException(`The currency exchange request with id = ${id} is not exist`);
        }
        return currencyExchange;
    }

    async approve(id: number): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            const currencyExchange = await this.getCurrencyExchange(id);
            if (currencyExchange.exchangeStatus == CurrencyExchangeStatus.COMPLETE) {
                throw new HttpException('The currency exchange request had been approved', HttpStatus.ACCEPTED);
            } else if (currencyExchange.exchangeStatus == CurrencyExchangeStatus.DENY) {
                throw new BadRequestException('The currency exchange request had been deny');
            }
            await prisma.currencyExchange.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    exchangeStatus: CurrencyExchangeStatus.COMPLETE,
                },
            });
        });
    }

    async deny(id: number): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            const currencyExchange = await this.getCurrencyExchange(id);
            if (currencyExchange.exchangeStatus == CurrencyExchangeStatus.COMPLETE) {
                throw new HttpException('The currency exchange request had been approved', HttpStatus.ACCEPTED);
            } else if (currencyExchange.exchangeStatus == CurrencyExchangeStatus.DENY) {
                throw new HttpException('The currency exchange request had been deny', HttpStatus.ACCEPTED);
            }
            await prisma.currencyExchange.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    exchangeStatus: CurrencyExchangeStatus.DENY,
                },
            });
            await prisma.member.update({
                where: {
                    id: currencyExchange.memberId,
                    isActive: true,
                },
                data: {
                    totalPoint: {
                        increment: currencyExchange.amount,
                    },
                },
            });
        });
    }
}