import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus, PaymentType, Prisma, ProductType, RefundStatus, TaxBillStatus } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PortoneService } from 'services/portone/portone.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { FileResponse } from 'utils/generics/file.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ProductCompanyTaxInvoiceType } from './enum/product-company-tax-invoice-type.enum';
import { ProductCompanyGetPaymentHistoryListRequest } from './request/product-company-payment-history-get-list-list.request';
import { ProductCompanyUsageHistoryGetListRequest } from './request/product-company-usage-history-get-list.request';
import { ProductCompanyCheckPremiumAvailabilityResponse } from './response/product-company-check-premium-availability.response';
import { ProductCompanyPaymentCreateResponse } from './response/product-company-payment-create.response';
import { ProductCompanyPaymentHistoryGetListResponse } from './response/product-company-payment-history-get-list-response';
import { ProductCompanyUsageHistoryGetListResponse } from './response/product-company-usage-history-get-list.response';
@Injectable()
export class ProductCompanyService {
    constructor(
        private prismaService: PrismaService,
        private portoneService: PortoneService,
    ) {}

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
            AND: [
                { ...(query.startDate && { updatedAt: { gte: new Date(query.startDate) } }) },
                { ...(query.endDate && { updatedAt: { lte: new Date(query.endDate) } }) },
            ],
            status: PaymentStatus.COMPLETE,
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
                refundStatus: item.refund ? item.refund.status : null,
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
                status: PaymentStatus.COMPLETE,
                ...(query.productType && { product: { productType: query.productType } }),
            },
            AND: [
                { ...(query.startDate && { createdAt: { gte: new Date(query.startDate) } }) },
                { ...(query.endDate && { createdAt: { lte: new Date(query.endDate) } }) },
            ],
        };

        const histories = await this.prismaService.usageHistory.groupBy({
            by: ['productPaymentHistoryId', 'createdAt'],
            where: queryFilter,
            _count: {
                id: true,
            },
            _min: {
                remainNumbers: true,
                expirationDate: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const count = histories.length;
        let pageHistories = null;
        if (query.pageNumber && query.pageSize) {
            const startIndex = (query.pageNumber - 1) * query.pageSize;
            const endIndex = startIndex + query.pageSize;
            pageHistories = histories.slice(startIndex, endIndex);
        } else {
            pageHistories = histories;
        }
        const result = await Promise.all(
            pageHistories.map(async (item) => {
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
                    remainNumber: item._min.remainNumbers,
                };
            }),
        );
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
                status: PaymentStatus.COMPLETE,
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
            throw new NotFoundException(Error.TAX_BILL_NOT_FOUND);
        }
        if (!record.taxBill.file) {
            throw new NotFoundException(Error.FILE_NOT_FOUND);
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
                status: PaymentStatus.COMPLETE,
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
            throw new NotFoundException(Error.CARD_RECEIPT_FOUND);
        }
        if (!record.cardReceipt.file) {
            throw new NotFoundException(Error.FILE_NOT_FOUND);
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
                status: PaymentStatus.COMPLETE,
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
            throw new NotFoundException(Error.PAYMENT_NOT_FOUND);
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

    async createPaymentHistory(id: number, accountId: number): Promise<ProductCompanyPaymentCreateResponse> {
        const product = await this.prismaService.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException(Error.PRODUCT_NOT_FOUND);
        const merchantId = await this.prismaService.$transaction(async (prisma) => {
            const date = new Date();
            const companyId = (
                await this.prismaService.company.findUnique({
                    where: {
                        accountId,
                    },
                })
            ).id;
            const productPaymentHistoryId = (
                await prisma.productPaymentHistory.create({
                    data: {
                        cost: product.price,
                        productId: id,
                        createdAt: date,
                        remainingTimes: product.countLimit,
                        expirationDate: new Date(),
                        companyId,
                    },
                })
            ).id;
            const merchantId = nanoid(40);
            await prisma.productPaymentHistory.update({
                where: { id: productPaymentHistoryId },
                data: {
                    merchantId: merchantId,
                },
                select: {
                    product: true,
                },
            });
            await this.portoneService.createPayment(product.price, merchantId);
            return merchantId;
        });
        return {
            merchantId: merchantId,
        };
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
                status: PaymentStatus.COMPLETE,
            },
            select: {
                id: true,
                expirationDate: true,
                usageHistories: true,
                refund: true,
            },
        });
        if (!paymentHistory) {
            throw new NotFoundException(Error.PAYMENT_NOT_FOUND);
        }
        if (!paymentHistory.refund) {
            if (paymentHistory.usageHistories.length > 0) {
                throw new BadRequestException(Error.PRODUCT_HAS_BEEN_USED);
            }
            const pastDate = paymentHistory.expirationDate;
            pastDate.setDate(pastDate.getDate() + 7);
            if (pastDate <= new Date()) {
                throw new BadRequestException(Error.REFUND_AVAILABLE_IN_SEVEN_DAYS);
            }
            await this.prismaService.refund.create({
                data: {
                    productPaymentHistoryId: paymentHistory.id,
                    status: RefundStatus.APPLY,
                },
            });
        } else {
            throw new BadRequestException(Error.REFUND_REQUEST_HAS_BEEN_HANDLED);
        }
    }

    async checkPremiumAvailability(accountId: number): Promise<ProductCompanyCheckPremiumAvailabilityResponse> {
        const availablePremiumList = await this.prismaService.productPaymentHistory.findMany({
            where: {
                isActive: true,
                status: PaymentStatus.COMPLETE,
                company: {
                    accountId,
                },
                product: {
                    productType: ProductType.PREMIUM_POST,
                },
                remainingTimes: { gt: 0 },
            },
        });
        return availablePremiumList
            ? {
                  isAvailable: true,
                  productList: availablePremiumList.map((item) => {
                      return {
                          id: item.id,
                          remainingTimes: item.remainingTimes,
                          remainingDates: Math.floor(
                              (new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                          ),
                      };
                  }),
              }
            : { isAvailable: false, productList: [] };
    }
}
