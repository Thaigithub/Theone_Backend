import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus, Prisma, ProductType, UsageType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { GetListType } from './enum/product-admin-get-list.enum';
import { ProductAdminRefundSearchCategory } from './enum/product-admin-refund-search-category.enum';
import { ProductAdminGetListRefundRequest } from './request/product-admin-get-list-refund.request';
import { ProductAdminUpdateFixedTermRequest } from './request/product-admin-update-fixed-term.request';
import { ProductAdminUpdateLimitedCountRequest } from './request/product-admin-update-limited-count.request';
import { ProductAdminUpdateRefundStatusRequest } from './request/product-admin-update-refund-status.request';
import { ProductAdminUpdateUsageCycleRequest } from './request/product-admin-update-usage-cycle.request';
import { ProductAdminGetDetailRefundResponse } from './response/product-admin-get-detail-refund.response';
import { ProductAdminGetListFixedTermResponse } from './response/product-admin-get-list-fixed-term.response';
import { ProductAdminGetListLimitedCountResponse } from './response/product-admin-get-list-limited-count.response';
import { ProductAdminGetListRefundResponse } from './response/product-admin-get-list-refund.response';
import { ProductAdminGetListUsageCycleResponse } from './response/product-admin-get-list-usage-cycle.response';
import { ProductAdminGetCompanyDetailLimitedCountResponse } from './response/product-admin-get-company-detail-limited-count.response';
import { ProductAdminGetCompanyDetailFixedTermResponse } from './response/product-admin-get-company-detail-fixed-term.response';
import { ProductAdminGetListSettlementRequest } from './request/product-admin-get-list-settlement.request';
import { ProductAdminGetListSettlementResponse } from './response/product-admin-get-list-settlement.response';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';

@Injectable()
export class ProductAdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}

    async getList(
        listType: GetListType,
    ): Promise<
        ProductAdminGetListLimitedCountResponse | ProductAdminGetListFixedTermResponse | ProductAdminGetListUsageCycleResponse
    > {
        const products = await this.prismaService.product.findMany({
            where: {
                isActive: true,
                OR:
                    listType === GetListType.LIMITED_COUNT || listType === GetListType.FIXED_TERM
                        ? [
                              listType === GetListType.LIMITED_COUNT
                                  ? {
                                        usageType: UsageType.LIMITED_COUNT,
                                    }
                                  : {},
                              listType === GetListType.FIXED_TERM
                                  ? {
                                        usageType: UsageType.FIX_TERM,
                                    }
                                  : {},
                          ]
                        : undefined,
            },
            orderBy: {
                id: 'asc',
            },
        });
        const transformedProductsList = products.reduce((result, product) => {
            const { id, productType, monthLimit, countLimit, price, usageCycle } = product;
            if (!result[productType]) {
                result[productType] = {};
            }
            switch (listType) {
                case GetListType.LIMITED_COUNT:
                    if (!result[productType][`_${countLimit}times`]) {
                        result[productType][`_${countLimit}times`] = { id, price };
                    }
                    break;
                case GetListType.FIXED_TERM:
                    if (!result[productType][`_${monthLimit}months`]) {
                        result[productType][`_${monthLimit}months`] = { id, countLimit, price };
                    }
                    break;
                case GetListType.USAGE_CYCLE:
                    if (!result[productType]['usageCycle']) {
                        result[productType]['usageCycle'] = usageCycle;
                    }
                    break;
            }
            return result;
        }, {});
        if (listType === GetListType.LIMITED_COUNT) {
            const monthLimitForLimitedCountProducts = (
                await this.prismaService.product.findFirst({
                    where: {
                        isActive: true,
                        usageType: UsageType.LIMITED_COUNT,
                    },
                })
            ).monthLimit;
            return {
                listProducts: transformedProductsList,
                monthLimit: monthLimitForLimitedCountProducts,
            } as ProductAdminGetListLimitedCountResponse;
        } else if (listType === GetListType.FIXED_TERM) return transformedProductsList as ProductAdminGetListFixedTermResponse;
        else if (listType === GetListType.USAGE_CYCLE) return transformedProductsList as ProductAdminGetListUsageCycleResponse;
    }

    async updateProductsLimitedCount(body: ProductAdminUpdateLimitedCountRequest): Promise<void> {
        const parsedProductsList: { id: number; price: number }[] = [];
        for (const productType in body.listProducts) {
            for (const countLimit in body.listProducts[productType]) {
                const { id, price } = body.listProducts[productType][countLimit];
                parsedProductsList.push({ id, price });
            }
        }
        await Promise.all(
            parsedProductsList.map(async (item) => {
                await this.prismaService.product.update({
                    data: {
                        price: item.price,
                        monthLimit: body.monthLimit,
                    },
                    where: {
                        isActive: true,
                        usageType: UsageType.LIMITED_COUNT,
                        id: item.id,
                    },
                });
            }),
        );
    }

    async updateProductsFixedTerm(body: ProductAdminUpdateFixedTermRequest): Promise<void> {
        const parsedProductsList: { id: number; price: number; countLimit: number }[] = [];
        for (const productType in body) {
            for (const monthLimit in body[productType]) {
                const { id, price, countLimit } = body[productType][monthLimit];
                parsedProductsList.push({ id, price, countLimit });
            }
        }
        await Promise.all(
            parsedProductsList.map(async (item) => {
                await this.prismaService.product.update({
                    data: {
                        countLimit: item.countLimit,
                        price: item.price,
                    },
                    where: {
                        isActive: true,
                        usageType: UsageType.FIX_TERM,
                        id: item.id,
                    },
                });
            }),
        );
    }

    async updateUsageCycle(body: ProductAdminUpdateUsageCycleRequest): Promise<void> {
        for (const productType in body) {
            await this.prismaService.product.updateMany({
                data: {
                    usageCycle: body[productType]['usageCycle'],
                },
                where: {
                    isActive: true,
                    productType: productType as ProductType,
                },
            });
        }
    }

    async getCompanyProductHistory(
        companyId: number,
        usageType: UsageType,
    ): Promise<ProductAdminGetCompanyDetailLimitedCountResponse | ProductAdminGetCompanyDetailFixedTermResponse> {
        const products = await this.prismaService.productPaymentHistory.findMany({
            include: {
                product: true,
            },
            where: {
                companyId,
                status: PaymentStatus.COMPLETE,
                product: {
                    usageType,
                },
                expirationDate: { gte: new Date() },
            },
            orderBy: {
                productId: 'asc',
            },
        });
        const transformedProducts = products.reduce((result, item) => {
            const { remainingTimes, product } = item;
            switch (usageType) {
                case UsageType.LIMITED_COUNT:
                    if (!result[product.productType]) result[product.productType] = 0;
                    result[product.productType] += remainingTimes;
                    break;
                case UsageType.FIX_TERM:
                    if (!result[product.productType]) result[product.productType] = {};
                    if (!result[product.productType][`_${product.monthLimit}months`])
                        result[product.productType][`_${product.monthLimit}months`] = 0;
                    result[product.productType][`_${product.monthLimit}months`] += remainingTimes;
                    break;
            }
            return result;
        }, {});
        return {
            products: transformedProducts,
        } as ProductAdminGetCompanyDetailLimitedCountResponse | ProductAdminGetCompanyDetailFixedTermResponse;
    }

    async getListRefund(query: ProductAdminGetListRefundRequest): Promise<ProductAdminGetListRefundResponse> {
        const search = {
            ...QueryPagingHelper.queryPaging(query),
            where: {
                status: query.status,
                createdAt: {
                    gte: query.startDate && new Date(query.startDate),
                    lte: query.endDate && new Date(query.endDate),
                },
                productPaymentHistory: {
                    company: {
                        name:
                            query.category &&
                            (query.category === ProductAdminRefundSearchCategory.COMPANY
                                ? { contains: query.keyword, mode: Prisma.QueryMode.insensitive }
                                : undefined),
                    },
                    status: PaymentStatus.COMPLETE,
                },
            },
            select: {
                id: true,
                productPaymentHistory: {
                    select: {
                        company: {
                            select: {
                                name: true,
                                presentativeName: true,
                                phone: true,
                            },
                        },
                        product: true,
                        cost: true,
                    },
                },
                status: true,
                createdAt: true,
            },
        };
        const refunds = (await this.prismaService.refund.findMany(search)).map((item) => {
            return {
                id: item.id,
                companyName: item.productPaymentHistory.company.name,
                presentativeName: item.productPaymentHistory.company.presentativeName,
                contact: item.productPaymentHistory.company.phone,
                productType: item.productPaymentHistory.product.productType,
                amount: item.productPaymentHistory.cost,
                status: item.status,
                createdAt: item.createdAt,
            };
        });
        const total = await this.prismaService.refund.count({ where: search.where });
        return new PaginationResponse(refunds, new PageInfo(total));
    }

    async getDetailRefund(id: number): Promise<ProductAdminGetDetailRefundResponse> {
        const refund = await this.prismaService.refund.findUnique({
            where: {
                isActive: true,
                id,
            },
            select: {
                productPaymentHistory: {
                    select: {
                        company: {
                            select: {
                                name: true,
                                presentativeName: true,
                                phone: true,
                            },
                        },
                        product: true,
                        cost: true,
                    },
                },
                status: true,
                createdAt: true,
            },
        });
        if (!refund) throw new NotFoundException('Refund not found');
        return {
            companyName: refund.productPaymentHistory.company.name,
            presentativeName: refund.productPaymentHistory.company.presentativeName,
            contact: refund.productPaymentHistory.company.phone,
            productType: refund.productPaymentHistory.product.productType,
            usageType: refund.productPaymentHistory.product.usageType,
            amount: refund.productPaymentHistory.cost,
            status: refund.status,
            createdAt: refund.createdAt,
        };
    }

    async updateRefundStatus(id: number, body: ProductAdminUpdateRefundStatusRequest): Promise<void> {
        const refund = await this.prismaService.refund.findUnique({
            where: {
                isActive: true,
                id,
            },
        });
        if (!refund) throw new NotFoundException('Refund not found');
        await this.prismaService.refund.update({
            where: {
                id,
            },
            data: {
                status: body.status,
                refundHistory: {
                    create: {
                        status: body.status,
                        reason: body.updateReason,
                    },
                },
            },
        });
    }

    async getListSettlement(query: ProductAdminGetListSettlementRequest): Promise<ProductAdminGetListSettlementResponse> {
        const queryFilter: Prisma.ProductPaymentHistoryWhereInput = {
            isActive: true,
            product: {
                productType: query.productType,
            },
            paymentType: query.paymentMethod,
            status: PaymentStatus.COMPLETE,
            ...(query.startPaymentDate && { createdAt: { gte: new Date(query.startPaymentDate) } }),
            ...(query.endPaymentDate && { createdAt: { lte: new Date(query.endPaymentDate) } }),
        };
        const settlements = await this.prismaService.productPaymentHistory.findMany({
            include: {
                company: true,
                product: true,
                refund: true,
            },
            where: queryFilter,
            orderBy: {
                id: 'asc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const list = settlements.map((item) => {
            return {
                id: item.id,
                companyName: item.company.name,
                productType: item.product.productType,
                paymentDate: item.createdAt.toISOString().split('T')[0],
                paymentMethod: item.paymentType,
                cost: item.cost,
                paymentStatus: item.status,
                refundStatus: item.refund ? item.refund.status : null,
            };
        });
        const total = await this.prismaService.productPaymentHistory.count({
            where: queryFilter,
        });
        return new ProductAdminGetListSettlementResponse(list, new PageInfo(total));
    }

    async downloadSettlement(idList: number[], response: Response): Promise<void> {
        const settlements = (
            await this.prismaService.productPaymentHistory.findMany({
                include: {
                    company: true,
                    product: true,
                    refund: true,
                },
                where: {
                    isActive: true,
                    id: { in: idList },
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                company_name: item.company.name,
                product_type: item.product.productType,
                payment_date: item.createdAt.toISOString().split('T')[0],
                payment_method: item.paymentType,
                cost: item.cost,
                payment_status: item.status,
                refund_status: item.refund ? item.refund.status : null,
            };
        });
        const excelStream = await this.excelService.createExcelFile(settlements, 'Settlements');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=SettlementList.xlsx');
        excelStream.pipe(response);
    }
}
