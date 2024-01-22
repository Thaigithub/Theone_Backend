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
    constructor(private readonly prismaService: PrismaService) {}

    async getList(accountId: number, query: InquiryCompanyGetListRequest): Promise<InquiryCompanyGetListResponse> {
        const search = {
            select: {
                id: true,
                questionTitle: true,
                status: true,
                createdAt: true,
            },

            where: {
                isActive: true,
                company: {
                    accountId,
                },
            },
            orderBy: {
                createdAt: Prisma.SortOrder.desc,
            },
            ...QueryPagingHelper.queryPaging(query),
        };

        const inquiries = (await this.prismaService.inquiry.findMany(search)).map((item) => {
            const { questionTitle, ...rest } = item;
            return {
                ...rest,
                title: questionTitle,
            };
        });
        const total = await this.prismaService.inquiry.count({ where: search.where });

        return new PaginationResponse(inquiries, new PageInfo(total));
    }

    async create(accountId: number, body: InquiryCompanyCreateRequest): Promise<void> {
        await this.prismaService.inquiry.create({
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
                questionFile: body.file
                    ? {
                          create: body.file,
                      }
                    : undefined,
            },
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
            },
        });

        if (!inquiry) throw new NotFoundException('Inquiry does not exist');

        return {
            id: inquiry.id,
            createdAt: inquiry.createdAt,
            inquiryType: inquiry.inquiryType,
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
}
