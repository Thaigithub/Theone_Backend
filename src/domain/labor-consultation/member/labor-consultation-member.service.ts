import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AnswerStatus, InquirerType, MemberLevel, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LaborConsultationMemberCreateRequest } from './request/labor-consultation-member-create.request';
import { LaborConsultationMemberGetListRequest } from './request/labor-consultation-member-get-list.request';
import { LaborConsultationMemberGetDetailResponse } from './response/labor-consultation-member-get-detail.response';
import { LaborConsultationMemberGetListResponse } from './response/labor-consultation-member-get-list.response';

@Injectable()
export class LaborConsultationMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(
        accountId: number,
        query: LaborConsultationMemberGetListRequest,
    ): Promise<LaborConsultationMemberGetListResponse> {
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

        const laborConsultations = (await this.prismaService.laborConsultation.findMany(search)).map((item) => {
            return {
                id: item.id,
                status: item.status,
                createdAt: item.createdAt,
                title: item.questionTitle,
                files: item.questionFiles.map((item) => {
                    return {
                        fileName: item.questionFile.fileName,
                        type: item.questionFile.type,
                        key: item.questionFile.key,
                        size: Number(item.questionFile.size),
                    };
                }),
            };
        });
        const total = await this.prismaService.laborConsultation.count({ where: search.where });

        return new PaginationResponse(laborConsultations, new PageInfo(total));
    }

    async create(accountId: number, body: LaborConsultationMemberCreateRequest): Promise<void> {
        const member = await this.prismaService.member.findUnique({
            where: {
                accountId,
                isActive: true,
            },
            select: {
                level: true,
            },
        });
        if (member && !Array<MemberLevel>(MemberLevel.GOLD, MemberLevel.PLATINUM, MemberLevel.SILVER).includes(member.level)) {
            throw new BadRequestException(Error.MEMBER_IS_NOT_CERTIFIED_LEVEL);
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

            await tx.laborConsultation.create({
                data: {
                    member: {
                        connect: {
                            accountId,
                        },
                    },
                    inquirerType: InquirerType.MEMBER,
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
        });
    }

    async getDetail(accountId: number, id: number): Promise<LaborConsultationMemberGetDetailResponse> {
        const laborConsultation = await this.prismaService.laborConsultation.findUnique({
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

    async getTotal(accountId: number): Promise<number> {
        return await this.prismaService.laborConsultation.count({
            where: {
                isActive: true,
                member: {
                    accountId,
                },
            },
        });
    }

    async getTotalInProgress(accountId: number): Promise<number> {
        return await this.prismaService.laborConsultation.count({
            where: {
                isActive: true,
                member: {
                    accountId,
                },
                status: AnswerStatus.WAITING,
            },
        });
    }
}
