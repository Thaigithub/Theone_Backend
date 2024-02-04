import { Injectable, NotFoundException } from '@nestjs/common';
import { InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { InquiryMemberCreateRequest } from './request/inquiry-member-create.request';
import { InquiryMemberGetListRequest } from './request/inquiry-member-get-list.request';
import { InquiryMemberGetDetailResponse } from './response/inquiry-member-get-detail.response';
import { InquiryMemberGetListResponse } from './response/inquiry-member-get-list.response';
import { InquiryMemberGetCountRequest } from './request/inquiry-member-get-count.request';
import { InquiryMemberGetCountType } from './enum/inquiry-member-get-count-type.enum';
import { InquiryMemberGetCountResponse } from './response/inquiry-member-get-count.response';
import { Error } from 'utils/error.enum';

@Injectable()
export class InquiryMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(accountId: number, query: InquiryMemberGetListRequest): Promise<InquiryMemberGetListResponse> {
        const search = {
            include: {
                questionFiles: {
                    include: {
                        questionFile: true,
                    },
                },
            },
            where: {
                isActive: true,
                member: {
                    accountId,
                },
            },
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

    async create(accountId: number, body: InquiryMemberCreateRequest): Promise<void> {
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
                    member: {
                        connect: {
                            accountId,
                        },
                    },
                    questionTitle: body.title,
                    questionContent: body.content,
                    inquiryType: body.type,
                    inquirerType: InquirerType.MEMBER,
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

    async getDetail(accountId: number, id: number): Promise<InquiryMemberGetDetailResponse> {
        const inquiry = await this.prismaService.inquiry.findUnique({
            where: {
                id,
                isActive: true,
                member: {
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

        if (!inquiry) throw new NotFoundException(Error.INQUIRY_NOT_FOUND);

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

    async getCount(accountId: number, query: InquiryMemberGetCountRequest): Promise<InquiryMemberGetCountResponse> {
        const count = await this.prismaService.inquiry.count({
            where: {
                isActive: true,
                member: {
                    accountId,
                },
                answerTitle: query.type === InquiryMemberGetCountType.REPLIED ? { not: null } : undefined,
            },
        });
        return { count };
    }
}
