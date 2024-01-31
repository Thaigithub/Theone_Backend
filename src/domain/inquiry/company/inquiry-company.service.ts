import { Injectable, NotFoundException } from '@nestjs/common';
import { InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { InquiryCompanyCreateRequest } from './request/inquiry-company-create.request';
import { InquiryCompanyGetListRequest } from './request/inquiry-company-get-list.request';
import { InquiryCompanyGetDetailResponse } from './response/inquiry-company-get-detail.response';
import { InquiryCompanyGetListResponse } from './response/inquiry-company-get-list.response';

@Injectable()
export class InquiryCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(accountId: number, query: InquiryCompanyGetListRequest): Promise<InquiryCompanyGetListResponse> {
        const queryFilter: Prisma.InquiryWhereInput = {
            isActive: true,
            company: {
                accountId,
            },
            ...(query.keyword && { questionTitle: { contains: query.keyword, mode: 'insensitive' } }),
        };

        const search = {
            include: {
                questionFiles: {
                    include: {
                        questionFile: true,
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                createdAt: Prisma.SortOrder.desc,
            },
            ...QueryPagingHelper.queryPaging(query),
        };

        const inquiries = (await this.prismaService.inquiry.findMany(search)).map((item) => {
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
        const total = await this.prismaService.inquiry.count({ where: search.where });

        return new PaginationResponse(inquiries, new PageInfo(total));
    }

    async create(accountId: number, body: InquiryCompanyCreateRequest): Promise<void> {
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

            await tx.inquiry.create({
                data: {
                    company: {
                        connect: {
                            accountId,
                        },
                    },
                    questionTitle: body.title,
                    questionContent: body.content,
                    inquiryType: body.type,
                    inquirerType: InquirerType.COMPANY,
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
        });
    }

    async getDetail(accountId: number, id: number): Promise<InquiryCompanyGetDetailResponse> {
        const inquiry = await this.prismaService.inquiry.findUnique({
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

        if (!inquiry) throw new NotFoundException('Inquiry does not exist');

        return {
            id: inquiry.id,
            createdAt: inquiry.createdAt,
            inquiryType: inquiry.inquiryType,
            status: inquiry.status,
            questionTitle: inquiry.questionTitle,
            questionContent: inquiry.questionContent,
            questionFiles: inquiry.questionFiles.map((item) => {
                return {
                    fileName: item.questionFile.fileName,
                    type: item.questionFile.type,
                    key: item.questionFile.key,
                    size: Number(item.questionFile.size),
                };
            }),
            asnweredAt: inquiry.answeredAt,
            answerTitle: inquiry.answerTitle,
            answerContent: inquiry.answerContent,
            answerFiles: inquiry.answerFiles.map((item) => {
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
