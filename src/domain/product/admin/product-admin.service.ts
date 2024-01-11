import { Injectable } from '@nestjs/common';
import { UsageType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { GetListType } from './dto/product-admin-get-list-type.enum';
import { ProductAdminUpdateFixedTermRequest } from './request/product-admin-update-fixed-term.request';
import { ProductAdminUpdateLimitedCountRequest } from './request/product-admin-update-limited-count.request';
import { ProductAdminUpdatePayAndUsageRequest } from './request/product-admin-update-pay-and-usage.request';
import { ProductAdminGetListPayAndUsageResponse } from './response/product-admin-get-list-pay-and-usage.response';
import { ProductAdminGetListFixedTermResponse } from './response/product-admin-get-list-fixed-term.response';
import { ProductAdminGetListLimitedCountResponse } from './response/product-admin-get-list-limited-count.response';

@Injectable()
export class ProductAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(
        listType: GetListType,
    ): Promise<
        ProductAdminGetListLimitedCountResponse | ProductAdminGetListFixedTermResponse | ProductAdminGetListPayAndUsageResponse
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
        });
        const transformedProductsList = products.reduce((result, product) => {
            const { id, productType, monthLimit, countLimit, price, isFree, usageCycle } = product;
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
                case GetListType.PAY_AND_USAGE:
                    if (!result[productType]['isFree']) {
                        result[productType]['isFree'] = isFree;
                    }
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
        else if (listType === GetListType.PAY_AND_USAGE) return transformedProductsList as ProductAdminGetListPayAndUsageResponse;
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
                        id: item.id,
                    },
                });
            }),
        );
    }

    async updatePayAndUsage(body: ProductAdminUpdatePayAndUsageRequest): Promise<void> {
        await Promise.all(
            body.payload.map(async (item) => {
                await this.prismaService.product.updateMany({
                    data: item,
                    where: {
                        productType: item.productType,
                    },
                });
            }),
        );
    }
}
