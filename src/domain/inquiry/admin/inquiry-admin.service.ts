import { Injectable, NotFoundException } from '@nestjs/common';
import { AnswerStatus, InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { InquiryAdminGetListSearchCategory } from './enum/inquiry-admin-get-list-search-category.enum';
import { InquiryAdminGetListRequest } from './request/inquiry-admin-get-list.request';
import { InquiryAdminAnswerRequest } from './request/inqury-admin-answer.request';
import { InquiryAdminGetDetailResponse } from './response/inquiry-admin-get-detail.reponse';
import { InquiryAdminGetListResponse } from './response/inquiry-admin-get-list.response';

@Injectable()
export class InquiryAdminService {
    constructor(private readonly prismaService: PrismaService) {}

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
            ...(query.searchCategory === InquiryAdminGetListSearchCategory.MEMBER_NAME && {
                member: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
            ...(query.searchCategory === InquiryAdminGetListSearchCategory.COMPANY_NAME && {
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

    async delete(id: number): Promise<void> {
        const inquiry = await this.prismaService.inquiry.count({
            where: {
                isActive: true,
                id,
            },
        });

        if (!inquiry) throw new NotFoundException('Inquiry does not exist');

        await this.prismaService.inquiry.update({
            where: {
                id,
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
                questionFile: {
                    where: {
                        isDeactivated: false,
                    },
                },
                answerFile: {
                    where: {
                        isDeactivated: false,
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
            questionFile: inquiry.questionFile
                ? {
                      fileName: inquiry.questionFile.fileName,
                      type: inquiry.questionFile.type,
                      key: inquiry.questionFile.key,
                      size: Number(inquiry.questionFile.size),
                  }
                : null,
            asnweredAt: inquiry.answeredAt,
            answerTitle: inquiry.answerTitle,
            answerContent: inquiry.answerContent,
            answerFile: inquiry.answerFile
                ? {
                      fileName: inquiry.answerFile.fileName,
                      type: inquiry.answerFile.type,
                      key: inquiry.answerFile.key,
                      size: Number(inquiry.answerFile.size),
                  }
                : null,
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
            if (inquiry.answerFileId)
                await tx.file.update({
                    where: {
                        id: inquiry.answerFileId,
                    },
                    data: {
                        isDeactivated: true,
                    },
                });

            await tx.inquiry.update({
                where: {
                    id,
                },
                data: {
                    answerTitle: body.title,
                    answerContent: body.content,
                    answerFile: {
                        create: body.file,
                    },
                    answeredAt: new Date().toISOString(),
                    status: AnswerStatus.COMPLETE,
                },
            });
        });
    }
}
