import { Injectable, NotFoundException } from '@nestjs/common';
import { InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { InquiryMemberCreateRequest } from './request/inquiry-member-create.request';
import { InquiryMemberGetListRequest } from './request/inquiry-member-get-list.request';
import { InquiryMemberGetDetailResponse } from './response/inquiry-member-get-detail.response';
import { InquiryMemberGetListResponse } from './response/inquiry-member-get-list.response';

@Injectable()
export class InquiryMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(accountId: number, query: InquiryMemberGetListRequest): Promise<InquiryMemberGetListResponse> {
        const search = {
            include: {
                questionFile: true,
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
                ...(item.questionFile && {
                    file: {
                        fileName: item.questionFile.fileName,
                        type: item.questionFile.type,
                        key: item.questionFile.key,
                        size: Number(item.questionFile.size),
                    },
                }),
            };
        });
        const total = await this.prismaService.inquiry.count({ where: search.where });

        return new PaginationResponse(inquiries, new PageInfo(total));
    }

    async create(accountId: number, body: InquiryMemberCreateRequest): Promise<void> {
        await this.prismaService.inquiry.create({
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
                questionFile: body.file
                    ? {
                          create: body.file,
                      }
                    : undefined,
            },
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
            status: inquiry.status,
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
