import { Injectable, NotFoundException } from '@nestjs/common';
import { AnswerStatus, InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { InquiryAdminGetListCategory } from './enum/inquiry-admin-get-list-category.enum';
import { InquiryAdminGetListRequest } from './request/inquiry-admin-get-list.request';
import { InquiryAdminAnswerRequest } from './request/inquiry-admin-update-answer.request';
import { InquiryAdminGetDetailResponse } from './response/inquiry-admin-get-detail.reponse';
import { InquiryAdminGetListResponse } from './response/inquiry-admin-get-list.response';

@Injectable()
export class InquiryAdminService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: InquiryAdminGetListRequest): Promise<InquiryAdminGetListResponse> {
        const queryFilter: Prisma.InquiryWhereInput = {
            isActive: true,
            ...(query.startDate &&
                query.endDate && {
                    createdAt: { gte: new Date(query.startDate), lte: new Date(query.endDate) },
                }),
            ...(query.status && { status: query.status }),
            ...(query.inquirerType && { inquirerType: query.inquirerType }),
            ...(query.inquiryType && { inquiryType: query.inquiryType }),
            ...(query.searchCategory === InquiryAdminGetListCategory.MEMBER_NAME && {
                member: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
            ...(query.searchCategory === InquiryAdminGetListCategory.COMPANY_NAME && {
                company: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
        };

        const search = {
            select: {
                id: true,
                inquirerType: true,
                inquiryType: true,
                questionTitle: true,
                status: true,
                createdAt: true,
                member: {
                    select: {
                        name: true,
                    },
                },
                company: {
                    select: {
                        name: true,
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
                inquirer:
                    item.inquirerType === InquirerType.MEMBER
                        ? {
                              type: item.inquirerType,
                              name: item.member.name,
                          }
                        : {
                              type: item.inquirerType,
                              name: item.company.name,
                          },
                inquiryType: item.inquiryType,
                title: item.questionTitle,
                status: item.status,
                createdAt: item.createdAt,
            };
        });
        const total = await this.prismaService.inquiry.count({ where: search.where });

        return new PaginationResponse(inquiries, new PageInfo(total));
    }

    async delete(ids: number[]): Promise<void> {
        await this.prismaService.inquiry.updateMany({
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

    async getDetail(id: number): Promise<InquiryAdminGetDetailResponse> {
        const inquiry = await this.prismaService.inquiry.findUnique({
            where: {
                id,
                isActive: true,
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
                member: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
                company: {
                    select: {
                        name: true,
                        contactPhone: true,
                    },
                },
            },
        });

        if (!inquiry) throw new NotFoundException('Inquiry does not exist');

        return {
            id: inquiry.id,
            createdAt: inquiry.createdAt,
            status: inquiry.status,
            inquiryType: inquiry.inquiryType,
            inquirer:
                inquiry.inquirerType === InquirerType.MEMBER
                    ? {
                          type: inquiry.inquirerType,
                          name: inquiry.member.name,
                          contact: inquiry.member.contact,
                      }
                    : {
                          type: inquiry.inquirerType,
                          name: inquiry.company.name,
                          contact: inquiry.company.contactPhone,
                      },
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

    async updateAnswer(id: number, body: InquiryAdminAnswerRequest): Promise<void> {
        const inquiry = await this.prismaService.inquiry.findUnique({
            where: {
                isActive: true,
                id,
            },
        });

        if (!inquiry) throw new NotFoundException('Inquiry does not exist');

        await this.prismaService.$transaction(async (tx) => {
            await tx.file.updateMany({
                where: {
                    answerInquiryFile: {
                        answerInquiryId: id,
                    },
                },
                data: {
                    isActive: false,
                },
            });

            await tx.inquiryFile.deleteMany({
                where: {
                    answerInquiryId: inquiry.id,
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

            await tx.inquiry.update({
                where: {
                    id,
                },
                data: {
                    answerTitle: body.title,
                    answerContent: body.content,
                    answerFiles: {
                        createMany: {
                            data: files.map((item) => {
                                return {
                                    answerFileId: item,
                                };
                            }),
                        },
                    },
                    answeredAt: new Date().toISOString(),
                    status: AnswerStatus.COMPLETE,
                },
            });
        });
    }
}
