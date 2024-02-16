import { Injectable, NotFoundException } from '@nestjs/common';
import { InquirerType, PaymentStatus, Prisma, ProductType, RefundStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LaborConsultationCompanyCreateRequest } from './request/labor-consultation-company-create.request';
import { LaborConsultationCompanyGetListRequest } from './request/labor-consultation-company-get-list.request';
import { LaborConsultationCompanyGetDetailResponse } from './response/labor-consultation-company-get-detail.response';
import { LaborConsultationCompanyGetListResponse } from './response/labor-consultation-company-get-list-response';

@Injectable()
export class LaborConsultationCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(
        accountId: number,
        query: LaborConsultationCompanyGetListRequest,
    ): Promise<LaborConsultationCompanyGetListResponse> {
        const search = {
            where: {
                isActive: true,
                company: {
                    accountId,
                },
            },
            include: {
                questionFiles: {
                    include: {
                        questionFile: true,
                    },
                },
            },
            orderBy: {
                createdAt: Prisma.SortOrder.desc,
            },
            ...QueryPagingHelper.queryPaging(query),
        };

        const laborConsultations = (await this.prismaService.laborConsultation.findMany(search)).map((item) => {
            return {
                id: item.id,
                title: item.questionTitle,
                status: item.status,
                createdAt: item.createdAt,
                files: item.questionFiles.map((fileItem) => {
                    return {
                        fileName: fileItem.questionFile.fileName,
                        type: fileItem.questionFile.type,
                        key: fileItem.questionFile.key,
                        size: Number(fileItem.questionFile.size),
                    };
                }),
            };
        });
        const total = await this.prismaService.laborConsultation.count({ where: search.where });

        return new PaginationResponse(laborConsultations, new PageInfo(total));
    }

    async create(accountId: number, body: LaborConsultationCompanyCreateRequest): Promise<void> {
        const productPaymentHistory = await this.prismaService.productPaymentHistory.findFirst({
            where: {
                product: {
                    productType: ProductType.LABOR_CONSULTATION,
                },
                status: PaymentStatus.COMPLETE,
                remainingTimes: { gt: 0 },
                expirationDate: { gt: new Date() },
                OR: [{ refund: null }, { refund: { NOT: { status: RefundStatus.APPROVED } } }],
                company: {
                    accountId,
                },
            },
            select: {
                id: true,
                remainingTimes: true,
                expirationDate: true,
            },
        });

        if (!productPaymentHistory) {
            throw new NotFoundException(Error.PRODUCT_NOT_FOUND);
        }

        await this.prismaService.$transaction(async (tx) => {
            const files = await Promise.all(
                body.files.map(async (item) => {
                    return (
                        await tx.file.create({
                            data: item,
                            select: {
                                id: true,
                            },
                        })
                    ).id;
                }),
            );

            const laborConsultation = await tx.laborConsultation.create({
                data: {
                    company: {
                        connect: {
                            accountId,
                        },
                    },
                    inquirerType: InquirerType.COMPANY,
                    questionTitle: body.title,
                    questionContent: body.content,
                    laborConsultationType: body.type,
                    questionFiles: {
                        createMany: {
                            data: files.map((item) => {
                                return {
                                    questionFileId: item,
                                };
                            }),
                        },
                    },
                },
            });

            await tx.laborConsultationRequest.create({
                data: {
                    laborConsultation: {
                        connect: {
                            id: laborConsultation.id,
                        },
                    },
                    company: {
                        connect: {
                            accountId,
                        },
                    },
                    usageHistory: {
                        create: {
                            productPaymentHistoryId: productPaymentHistory.id,
                            expirationDate: productPaymentHistory.expirationDate,
                            remainNumbers: productPaymentHistory.remainingTimes - 1,
                        },
                    },
                },
            });

            await tx.productPaymentHistory.update({
                where: {
                    id: productPaymentHistory.id,
                },
                data: {
                    remainingTimes: productPaymentHistory.remainingTimes - 1,
                },
            });
        });
    }

    async getDetail(accountId: number, id: number): Promise<LaborConsultationCompanyGetDetailResponse> {
        const laborConsultation = await this.prismaService.laborConsultation.findUnique({
            where: {
                id,
                isActive: true,
                company: {
                    accountId,
                },
            },
            include: {
                questionFiles: {
                    include: {
                        questionFile: true,
                    },
                },
                answerFiles: {
                    include: {
                        answerFile: true,
                    },
                },
            },
        });

        if (!laborConsultation) throw new NotFoundException(Error.LABOR_CONSULTATION_NOT_FOUND);

        return {
            id: laborConsultation.id,
            createdAt: laborConsultation.createdAt,
            laborConsultationType: laborConsultation.laborConsultationType,
            status: laborConsultation.status,
            questionTitle: laborConsultation.questionTitle,
            questionContent: laborConsultation.questionContent,
            questionFiles: laborConsultation.questionFiles.map((item) => {
                return {
                    fileName: item.questionFile.fileName,
                    type: item.questionFile.type,
                    key: item.questionFile.key,
                    size: Number(item.questionFile.size),
                };
            }),
            answeredAt: laborConsultation.answeredAt,
            answerTitle: laborConsultation.answerTitle,
            answerContent: laborConsultation.answerContent,
            answerFiles: laborConsultation.answerFiles.map((item) => {
                return {
                    fileName: item.answerFile.fileName,
                    type: item.answerFile.type,
                    key: item.answerFile.key,
                    size: Number(item.answerFile.size),
                };
            }),
        };
    }
}
