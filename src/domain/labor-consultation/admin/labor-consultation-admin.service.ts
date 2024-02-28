import { Injectable, NotFoundException } from '@nestjs/common';
import { AnswerStatus, InquirerType, NotificationType, Prisma } from '@prisma/client';
import { NotificationCompanyService } from 'domain/notification/company/notification-company.service';
import { NotificationMemberService } from 'domain/notification/member/notification-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { LaborConsultationAdminGetListCategory } from './enum/labor-consultation-admin-get-list-category.enum';
import { LaborConsultationAdminAnswerRequest } from './request/labor-consultation-admin-answer.request';
import { LaborConsultationAdminGetListRequest } from './request/labor-consultation-admin-get-list.request';
import { LaborConsultationAdminGetDetailResponse } from './response/labor-consultation-admin-get-detail.response';
import { LaborConsultationAdminGetListResponse } from './response/labor-consultation-admin-get-list.response';

@Injectable()
export class LaborConsultationAdminService {
    constructor(
        private prismaService: PrismaService,
        private notificationCompanyService: NotificationCompanyService,
        private notifcationMemberService: NotificationMemberService,
    ) {}

    async getList(query: LaborConsultationAdminGetListRequest): Promise<LaborConsultationAdminGetListResponse> {
        const queryFilter: Prisma.LaborConsultationWhereInput = {
            isActive: true,
            ...(query.startDate && { createdAt: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { createdAt: { lte: new Date(query.endDate) } }),
            ...(query.status && { status: query.status }),
            ...(query.inquirerType && { inquirerType: query.inquirerType }),
            ...(query.laborConsultationType && { laborConsultationType: query.laborConsultationType }),
            ...(query.searchCategory === LaborConsultationAdminGetListCategory.MEMBER_NAME && {
                member: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
            ...(query.searchCategory === LaborConsultationAdminGetListCategory.COMPANY_NAME && {
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

        if (!laborConsultation) throw new NotFoundException(Error.LABOR_CONSULTATION_NOT_FOUND);

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

    async updateAnswer(id: number, body: LaborConsultationAdminAnswerRequest): Promise<void> {
        const laborConsultation = await this.prismaService.laborConsultation.findUnique({
            where: {
                isActive: true,
                id,
            },
            select: {
                member: {
                    select: {
                        accountId: true,
                    },
                },
                company: {
                    select: {
                        accountId: true,
                    },
                },
            },
        });

        if (!laborConsultation) throw new NotFoundException(Error.LABOR_CONSULTATION_NOT_FOUND);

        await this.prismaService.$transaction(async (tx) => {
            await tx.file.deleteMany({
                where: {
                    key: {
                        notIn: body.files.map((item) => item.key),
                    },
                    answerLaborConsultationFile: {
                        answerLaborConsultationId: id,
                    },
                },
            });

            await Promise.all(
                body.files.map(async (item) => {
                    await tx.file.upsert({
                        create: {
                            fileName: item.fileName,
                            size: item.size,
                            type: item.type,
                            key: item.key,
                            answerLaborConsultationFile: {
                                create: {
                                    answerLaborConsultationId: id,
                                },
                            },
                        },
                        update: {},
                        where: {
                            key: item.key,
                        },
                        select: {
                            id: true,
                        },
                    });
                }),
            );

            await tx.laborConsultation.update({
                where: {
                    id,
                },
                data: {
                    answerTitle: body.title,
                    answerContent: body.content,
                    answeredAt: new Date(),
                    status: AnswerStatus.COMPLETE,
                },
            });
        });

        if (laborConsultation.company) {
            await this.notificationCompanyService.create(
                laborConsultation.company.accountId,
                '노무상담에 대한 답변이 달렸습니다.',
                '',
                NotificationType.LABOR_CONSULTATION,
                id,
            );
        } else if (laborConsultation.member) {
            await this.notifcationMemberService.create(
                laborConsultation.member.accountId,
                '노무상담에 대한 답변이 달렸습니다.',
                '',
                NotificationType.LABOR_CONSULTATION,
                id,
            );
        }
    }
}
