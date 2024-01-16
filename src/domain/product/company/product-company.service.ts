import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentType, Prisma, RefundStatus, TaxBillStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { FileResponse } from 'utils/generics/file.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ProductCompanyTaxInvoiceType } from './enum/product-company-tax-invoice-type.enum';
import { ProductCompanyGetPaymentHistoryListRequest } from './request/product-company-payment-history-get-list-list.request';
import { ProductCompanyUsageHistoryGetListRequest } from './request/product-company-usage-history-get-list.request';
import { ProductCompanyPaymentHistoryGetListResponse } from './response/product-company-payment-history-get-list-response';
import { ProductCompanyUsageHistoryGetListResponse } from './response/product-company-usage-history-get-list.response';

@Injectable()
export class ProductCompanyService {
    constructor(private readonly prismaService: PrismaService) {}
    async getPaymentHistoryList(
        accountId: number,
        query: ProductCompanyGetPaymentHistoryListRequest,
    ): Promise<ProductCompanyPaymentHistoryGetListResponse> {
        const queryFilter: Prisma.ProductPaymentHistoryWhereInput = {
            company: {
                isActive: true,
                accountId: accountId,
            },
            ...(query.productType && { product: { productType: query.productType } }),
            ...(query.taxInvoiceType &&
                query.taxInvoiceType === ProductCompanyTaxInvoiceType.REQUEST && {
                    OR: [{ taxBill: { status: TaxBillStatus.NOT_ISSUED } }, { taxBill: null }],
                }),
            ...(query.taxInvoiceType &&
                query.taxInvoiceType === ProductCompanyTaxInvoiceType.WAITING && {
                    taxBill: { status: TaxBillStatus.ISSUED_REQUESTED },
                }),
            ...(query.taxInvoiceType === ProductCompanyTaxInvoiceType.COMPLETED && {
                taxBill: {
                    OR: [{ status: TaxBillStatus.ISSUED_COMPLETED }, { status: TaxBillStatus.MODIFIED_ISSUED_COMPLETED }],
                },
            }),
        };
        const histories = (
            await this.prismaService.productPaymentHistory.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    product: {
                        select: {
                            productType: true,
                            countLimit: true,
                            monthLimit: true,
                            usageType: true,
                        },
                    },
                    createdAt: true,
                    cost: true,
                    paymentType: true,
                    cardReceipt: {
                        where: {
                            isActive: true,
                        },
                        select: {
                            id: true,
                            status: true,
                        },
                    },
                    taxBill: {
                        select: {
                            id: true,
                            status: true,
                            file: true,
                        },
                    },
                    refund: {
                        select: {
                            id: true,
                            status: true,
                        },
                    },
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            let taxIssuanceStatus = null;
            if (item.paymentType === PaymentType.BANK_TRANSFER) {
                if (item.taxBill) {
                    if (item.taxBill.status === TaxBillStatus.NOT_ISSUED) {
                        taxIssuanceStatus = ProductCompanyTaxInvoiceType.REQUEST;
                    } else if (item.taxBill.status === TaxBillStatus.ISSUED_REQUESTED) {
                        taxIssuanceStatus = ProductCompanyTaxInvoiceType.WAITING;
                    } else {
                        taxIssuanceStatus = ProductCompanyTaxInvoiceType.COMPLETED;
                    }
                } else {
                    taxIssuanceStatus = ProductCompanyTaxInvoiceType.REQUEST;
                }
            }

            return {
                id: item.id,
                product: {
                    type: item.product.productType,
                    countLimit: item.product.countLimit,
                    monthLimit: item.product.monthLimit,
                    usageType: item.product.usageType,
                },
                createdAt: item.createdAt,
                cost: item.cost,
                paymentType: item.paymentType,
                cardReceiptStatus: item.cardReceipt ? item.cardReceipt.status : null,
                taxBillStatus: taxIssuanceStatus ? taxIssuanceStatus : null,
                refundStatus: item.refund ? item.refund.status : RefundStatus.APPLY,
            };
        });
        const count = await this.prismaService.productPaymentHistory.count({
            where: queryFilter,
        });
        return new PaginationResponse(histories, new PageInfo(count));
    }

    async getUsageHistory(
        accountId: number,
        query: ProductCompanyUsageHistoryGetListRequest,
    ): Promise<ProductCompanyUsageHistoryGetListResponse> {
        const queryFilter: Prisma.UsageHistoryWhereInput = {
            productPaymentHistory: {
                company: {
                    accountId: accountId,
                    isActive: true,
                },
            },
            ...(query.productType && {
                product: {
                    productType: query.productType,
                },
            }),
            ...(query.createdAt && { createdAt: new Date(query.createdAt) }),
        };

        const histories = await this.prismaService.usageHistory.groupBy({
            by: ['productPaymentHistoryId', 'createdAt'],
            where: queryFilter,
            _count: {
                id: true,
            },
            _min: {
                remainNumber: true,
                expirationDate: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: (query.pageNumber - 1) * query.pageSize,
            take: query.pageSize,
        });
        const result = await Promise.all(
            histories.map(async (item) => {
                const product = await this.prismaService.productPaymentHistory.findUnique({
                    where: {
                        id: item.productPaymentHistoryId,
                    },
                    select: {
                        product: {
                            select: {
                                productType: true,
                                countLimit: true,
                                monthLimit: true,
                                usageType: true,
                            },
                        },
                    },
                });
                return {
                    product: product
                        ? {
                              productType: product.product.productType,
                              countLimit: product.product.countLimit,
                              monthLimit: product.product.monthLimit,
                              usageType: product.product.usageType,
                          }
                        : null,
                    createdAt: item.createdAt,
                    expirationDate: item._min.expirationDate,
                    numberOfUses: item._count.id,
                    remainNumber: item._min.remainNumber,
                };
            }),
        );

        const count = await this.prismaService.usageHistory.count({
            where: queryFilter,
        });
        return new PaginationResponse(result, new PageInfo(count));
    }

    async getTaxBill(accountId: number, id: number): Promise<FileResponse> {
        const record = await this.prismaService.productPaymentHistory.findUnique({
            where: {
                id: id,
                paymentType: PaymentType.BANK_TRANSFER,
                taxBill: {
                    isActive: true,
                    OR: [{ status: TaxBillStatus.ISSUED_COMPLETED }, { status: TaxBillStatus.MODIFIED_ISSUED_COMPLETED }],
                },
                company: {
                    isActive: true,
                    accountId: accountId,
                },
            },
            select: {
                taxBill: {
                    select: {
                        file: {
                            select: {
                                fileName: true,
                                type: true,
                                key: true,
                                size: true,
                            },
                        },
                    },
                },
            },
        });
        if (!record) {
            throw new NotFoundException('The taxbill id is not found');
        }
        if (!record.taxBill.file) {
            throw new NotFoundException('The file is not found');
        }
        return {
            fileName: record.taxBill.file.fileName,
            key: record.taxBill.file.key,
            type: record.taxBill.file.type,
            size: Number(record.taxBill.file.size),
        } as FileResponse;
    }

    async getcardReceipt(accountId: number, id: number) {
        const record = await this.prismaService.productPaymentHistory.findUnique({
            where: {
                id: id,
                paymentType: PaymentType.CREDIT_CARD,
                cardReceipt: {
                    isActive: true,
                },
                company: {
                    isActive: true,
                    accountId: accountId,
                },
            },
            select: {
                cardReceipt: {
                    select: {
                        file: {
                            select: {
                                fileName: true,
                                type: true,
                                key: true,
                                size: true,
                            },
                        },
                    },
                },
            },
        });
        if (!record) {
            throw new NotFoundException('The card receipt id is not found');
        }
        if (!record.cardReceipt.file) {
            throw new NotFoundException('The file is not found');
        }
        return {
            fileName: record.cardReceipt.file.fileName,
            key: record.cardReceipt.file.key,
            type: record.cardReceipt.file.type,
            size: Number(record.cardReceipt.file.size),
        } as FileResponse;
    }

    async createTaxBillRequest(accountId: number, id: number): Promise<void> {
        const paymentHistory = await this.prismaService.productPaymentHistory.findUnique({
            where: {
                id: id,
                paymentType: PaymentType.BANK_TRANSFER,
                isActive: true,
                company: {
                    accountId: accountId,
                },
            },
            select: {
                taxBill: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });
        if (!paymentHistory) {
            throw new NotFoundException('The payment history id is not found');
        }
        if (!paymentHistory.taxBill) {
            await this.prismaService.taxBill.create({
                data: {
                    productPaymentHistoryId: id,
                    status: TaxBillStatus.ISSUED_REQUESTED,
                },
            });
        }
    }

    async createRefund(accountId: number, id: number): Promise<void> {
        const paymentHistory = await this.prismaService.productPaymentHistory.findUnique({
            where: {
                id: id,
                isActive: true,
                company: {
                    accountId: accountId,
                    isActive: true,
                },
            },
            select: {
                id: true,
                expirationDate: true,
                usageHistory: true,
                refund: true,
            },
        });
        if (!paymentHistory) {
            throw new NotFoundException('The payment history id is not found');
        }
        if (!paymentHistory.refund) {
            if (paymentHistory.usageHistory.length > 0) {
                throw new BadRequestException('The product has been used');
            }
            const pastDate = paymentHistory.expirationDate;
            pastDate.setDate(pastDate.getDate() + 7);
            if (pastDate <= new Date()) {
                throw new BadRequestException('No refund after 7 days');
            }
            await this.prismaService.refund.create({
                data: {
                    productPaymentHistoryId: paymentHistory.id,
                    status: RefundStatus.APPLY,
                },
            });
        } else {
            throw new BadRequestException('The refund request has been handled');
        }
    }
}
