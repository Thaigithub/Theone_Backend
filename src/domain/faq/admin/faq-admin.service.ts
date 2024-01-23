import { Injectable, NotFoundException } from '@nestjs/common';
import { InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { FaqAdminGetListSearchCategory } from './enum/faq-admin-get-list-search-category.enum';
import { FaqAdminCreateRequest } from './request/faq-admin-create.request';
import { FaqAdminGetListRequest } from './request/faq-admin-get-list.request';
import { FaqAdminUpdateRequest } from './request/faq-admin-update.request';
import { FaqAdminGetDetailResponse } from './response/faq-admin-get-detail.response';
import { FaqAdminGetListResponse } from './response/faq-admin-get-list.response';
@Injectable()
export class FaqAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: FaqAdminGetListRequest): Promise<FaqAdminGetListResponse> {
        const queryFilter: Prisma.FaqWhereInput = {
            isActive: true,
            ...(query.searchCategory === FaqAdminGetListSearchCategory.QUESTION && {
                question: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.searchCategory === FaqAdminGetListSearchCategory.ANSWER && {
                answer: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.inquirerType && {
                inquirerType: InquirerType[query.inquirerType],
            }),
        };

        const search = {
            select: {
                id: true,
                createdAt: true,
                inquirerType: true,
                question: true,
                answer: true,
                writer: true,
                category: true,
            },
            where: queryFilter,
            ...QueryPagingHelper.queryPaging(query),
        };
        const faqs = await this.prismaService.faq.findMany(search);
        const total = await this.prismaService.faq.count({ where: search.where });

        return new PaginationResponse(faqs, new PageInfo(total));
    }

    async create(body: FaqAdminCreateRequest): Promise<void> {
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

            await tx.faq.create({
                data: {
                    question: body.question,
                    answer: body.answer,
                    writer: body.writer,
                    inquirerType: body.inquirerType,
                    category: body.category,
                    faqFiles: {
                        createMany: {
                            data: files.map((item) => {
                                return {
                                    fileId: item,
                                };
                            }),
                        },
                    },
                },
            });
        });
    }

    async delete(ids: number[]): Promise<void> {
        await this.prismaService.faq.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                isActive: false,
            },
        });
    }

    async getDetail(id: number): Promise<FaqAdminGetDetailResponse> {
        const faq = await this.prismaService.faq.findUnique({
            where: {
                id,
                isActive: true,
            },
            include: {
                faqFiles: {
                    include: {
                        file: true,
                    },
                    where: {
                        file: {
                            isDeactivated: false,
                        },
                    },
                },
            },
        });

        if (!faq) throw new NotFoundException('Faq does not exist');

        return {
            id: faq.id,
            createdAt: faq.createdAt,
            inquirerType: faq.inquirerType,
            question: faq.question,
            answer: faq.answer,
            writer: faq.writer,
            category: faq.category,
            files: faq.faqFiles.map((item) => {
                return {
                    fileName: item.file.fileName,
                    type: item.file.type,
                    key: item.file.key,
                    size: Number(item.file.size),
                };
            }),
        };
    }

    async update(id: number, body: FaqAdminUpdateRequest): Promise<void> {
        const faq = await this.prismaService.faq.count({
            where: {
                isActive: true,
                id,
            },
        });

        if (!faq) throw new NotFoundException('Faq does not exist');

        await this.prismaService.$transaction(async (tx) => {
            await tx.file.updateMany({
                where: {
                    faqFile: {
                        faqId: id,
                    },
                },
                data: {
                    isDeactivated: true,
                },
            });

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

            await tx.faq.update({
                where: {
                    id,
                },
                data: {
                    question: body.question,
                    answer: body.answer,
                    writer: body.writer,
                    inquirerType: body.inquirerType,
                    category: body.category,
                    faqFiles: {
                        createMany: {
                            data: files.map((item) => {
                                return {
                                    fileId: item,
                                };
                            }),
                        },
                    },
                },
            });
        });
    }
}
