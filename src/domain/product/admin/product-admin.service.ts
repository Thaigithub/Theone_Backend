import { Injectable } from '@nestjs/common';
import { ProductPeriod } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { GetListType } from './dto/product-admin-get-list-type.enum';
import { ProductAdminUpdatePayAndUsageRequest } from './request/product-admin-update-pay-and-usage.request';
import { ProductAdminUpdateByNumberRequest } from './request/product-admin-update-by-number.request';
import { ProductAdminUpdateByTermRequest } from './request/product-admin-update-by-term.request';

@Injectable()
export class ProductAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(listType: GetListType): Promise<any> {
        const products = await this.prismaService.product.findMany({
            where: {
                isActive: true,
                OR:
                    listType === GetListType.BY_NUMBER || listType === GetListType.BY_TERM
                        ? [
                              listType === GetListType.BY_NUMBER
                                  ? {
                                        period: ProductPeriod.PERMANENT,
                                    }
                                  : {},
                              listType === GetListType.BY_TERM
                                  ? {
                                        period: { not: ProductPeriod.PERMANENT },
                                    }
                                  : {},
                          ]
                        : undefined,
            },
        });
        const transformedProductsList = products.reduce((result, product) => {
            const { id, productType, period, numberOfTimes, price, isFree, usageCycle } = product;
            if (!result[productType]) {
                result[productType] = {};
            }
            switch (listType) {
                case GetListType.BY_NUMBER:
                    if (!result[productType][`_${numberOfTimes}times`]) {
                        result[productType][`_${numberOfTimes}times`] = { id, price };
                    }
                    break;
                case GetListType.BY_TERM:
                    if (!result[productType][period]) {
                        result[productType][period] = { id, numberOfTimes, price };
                    }
                    break;
                case GetListType.BY_PAY_AND_USAGE:
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
        return transformedProductsList;
    }

    async updateProductsByNumber(body: ProductAdminUpdateByNumberRequest): Promise<void> {
        const parsedProductsList: { id: number; price: number }[] = [];
        for (const productType in body) {
            for (const numberOfTimes in body[productType]) {
                const { id, price } = body[productType][numberOfTimes];
                parsedProductsList.push({ id, price });
            }
        }
        await Promise.all(
            parsedProductsList.map(async (item) => {
                await this.prismaService.product.update({
                    data: {
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

    async updateProductsByTerm(body: ProductAdminUpdateByTermRequest): Promise<void> {
        const parsedProductsList: { id: number; price: number; numberOfTimes: number }[] = [];
        for (const productType in body) {
            for (const period in body[productType]) {
                const { id, price, numberOfTimes } = body[productType][period];
                parsedProductsList.push({ id, price, numberOfTimes });
            }
        }
        await Promise.all(
            parsedProductsList.map(async (item) => {
                await this.prismaService.product.update({
                    data: {
                        numberOfTimes: item.numberOfTimes,
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
