import { Injectable, NotFoundException } from '@nestjs/common';
import { AnswerStatus, InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { LaborConsultationAdminGetListSearchCategory } from './enum/labor-consultation-admin-get-list-search-category.enum';
import { LaborConsultationAdminAnswerRequest } from './request/labor-consultation-admin-answer.request';
import { LaborConsultationAdminGetListRequest } from './request/labor-consultation-admin-get-list.request';
import { LaborConsultationAdminGetDetailResponse } from './response/labor-consultation-admin-get-detail.response';
import { LaborConsultationAdminGetListResponse } from './response/labor-consultation-admin-get-list.response';

@Injectable()
export class LaborConsultationAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: LaborConsultationAdminGetListRequest): Promise<LaborConsultationAdminGetListResponse> {
        const queryFilter: Prisma.LaborConsultationWhereInput = {
            isActive: true,
            ...(query.startDate &&
                query.endDate && {
                    createdAt: { gte: new Date(query.startDate), lte: new Date(query.endDate) },
                }),
            ...(query.status && { status: query.status }),
            ...(query.inquirerType && { inquirerType: query.inquirerType }),
            ...(query.laborConsultationType && { laborConsultationType: query.laborConsultationType }),
            ...(query.searchCategory === LaborConsultationAdminGetListSearchCategory.MEMBER_NAME && {
                member: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
            ...(query.searchCategory === LaborConsultationAdminGetListSearchCategory.COMPANY_NAME && {
                company: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
        };

        const search = {
            select: {
                id: true,
                inquirerType: true,
                laborConsultationType: true,
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

        const laborConsultations = (await this.prismaService.laborConsultation.findMany(search)).map((item) => {
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
                laborConsultationType: item.laborConsultationType,
                title: item.questionTitle,
                status: item.status,
                createdAt: item.createdAt,
            };
        });
        const total = await this.prismaService.laborConsultation.count({ where: search.where });

        return new PaginationResponse(laborConsultations, new PageInfo(total));
    }

    async delete(ids: number[]): Promise<void> {
        await this.prismaService.laborConsultation.updateMany({
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

    async getDetail(id: number): Promise<LaborConsultationAdminGetDetailResponse> {
        const laborConsultation = await this.prismaService.laborConsultation.findUnique({
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

        if (!laborConsultation) throw new NotFoundException('Labor consultation does not exist');

        return {
            id: laborConsultation.id,
            createdAt: laborConsultation.createdAt,
            status: laborConsultation.status,
            laborConsultationType: laborConsultation.laborConsultationType,
            inquirer:
                laborConsultation.inquirerType === InquirerType.MEMBER
                    ? {
                          type: laborConsultation.inquirerType,
                          name: laborConsultation.member.name,
                          contact: laborConsultation.member.contact,
                      }
                    : {
                          type: laborConsultation.inquirerType,
                          name: laborConsultation.company.name,
                          contact: laborConsultation.company.contactPhone,
                      },
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
            asnweredAt: laborConsultation.answeredAt,
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

    async updateAnswer(id: number, body: LaborConsultationAdminAnswerRequest): Promise<void> {
        const laborConsultation = await this.prismaService.laborConsultation.findUnique({
            where: {
                isActive: true,
                id,
            },
        });

        if (!laborConsultation) throw new NotFoundException('Labor consultation does not exist');

        await this.prismaService.$transaction(async (tx) => {
            await tx.file.updateMany({
                where: {
                    answerLaborConsultationFiles: {
                        some: {
                            answerLaborConsultationId: id,
                        },
                    },
                },
                data: {
                    isDeactivated: true,
                },
            });

            await tx.laborConsultationFile.deleteMany({
                where: {
                    answerLaborConsultationId: laborConsultation.id,
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

            await tx.laborConsultation.update({
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
