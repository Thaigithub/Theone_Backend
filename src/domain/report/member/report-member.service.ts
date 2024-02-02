import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ReportMemberCreateRequest } from './request/report-member-create.request';
import { ReportMemberGetListRequest } from './request/report-member-get-list.request';
import { ReportMemberGetDetailResponse } from './response/report-member-get-detail.response';
import { ReportMemberGetListResponse } from './response/report-member-get-list.response';

@Injectable()
export class ReportMemberService {
    constructor(private prismaService: PrismaService) {}

    async create(accountId: number, body: ReportMemberCreateRequest): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            const report = await prisma.report.create({
                data: {
                    member: {
                        connect: {
                            accountId,
                        },
                    },
                    questionTitle: body.title,
                    questionContent: body.content,
                    reportType: body.type,
                },
                select: {
                    id: true,
                },
            });

            await prisma.file.createMany({
                data: body.files.map((item) => {
                    return {
                        ...item,
                        reportFile: {
                            create: {
                                questionReportId: report.id,
                            },
                        },
                    };
                }),
            });
        });
    }

    async getList(accountId: number, query: ReportMemberGetListRequest): Promise<ReportMemberGetListResponse> {
        const queryFilter: Prisma.ReportWhereInput = {
            isActive: true,
            member: {
                accountId,
            },
        };
        const list = (
            await this.prismaService.report.findMany({
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                title: item.questionTitle,
                createAt: item.createdAt,
                status: item.status,
            };
        });
        const total = await this.prismaService.report.count({
            where: queryFilter,
        });
        return new PaginationResponse(list, new PageInfo(total));
    }

    async getDetail(accountId: number, reportId: number): Promise<ReportMemberGetDetailResponse> {
        const report = await this.prismaService.report.findUnique({
            include: {
                questionFiles: {
                    include: {
                        file: true,
                    },
                },
                answerFiles: {
                    include: {
                        file: true,
                    },
                },
            },
            where: {
                isActive: true,
                id: reportId,
                member: {
                    accountId,
                },
            },
        });
        if (!report) throw new NotFoundException('Report does not exist');
        return {
            id: report.id,
            questionTitle: report.questionTitle,
            questionContent: report.questionContent,
            questionFiles:
                report.questionFiles?.map((item) => {
                    return {
                        fileName: item.file.fileName,
                        type: item.file.type,
                        key: item.file.key,
                        size: Number(item.file.size),
                    };
                }) || [],
            reportType: report.reportType,
            createAt: report.createdAt,
            status: report.status,
            answerTitle: report.answerTitle,
            answerContent: report.answerContent,
            answerFiles:
                report.answerFiles?.map((item) => {
                    return {
                        fileName: item.file.fileName,
                        type: item.file.type,
                        key: item.file.key,
                        size: Number(item.file.size),
                    };
                }) || [],
            answeredAt: report.answeredAt,
        };
    }
}
