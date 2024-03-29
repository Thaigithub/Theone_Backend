import { Injectable, NotFoundException } from '@nestjs/common';
import { AnswerStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ReportAdminGetListRequest } from './request/report-admin-get-list.request';
import { ReportAdminUpdateRequest } from './request/report-admin-update.request';
import { ReportAdminGetDetailResponse } from './response/report-admin-get-detail.response';
import { ReportAdminGetListResponse } from './response/report-admin-get-list.response';

@Injectable()
export class ReportAdminService {
    constructor(private prismaService: PrismaService) {}

    private async checkReportExist(reportId: number) {
        const report = await this.prismaService.report.findUnique({
            include: {
                member: true,
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
                isAdminDeleted: false,
            },
        });
        if (!report) throw new NotFoundException(Error.REPORT_NOT_FOUND);
        return report;
    }

    async update(reportId: number, body: ReportAdminUpdateRequest): Promise<void> {
        await this.checkReportExist(reportId);
        await this.prismaService.$transaction(async (prisma) => {
            const report = await prisma.report.update({
                where: {
                    id: reportId,
                },
                data: {
                    answerTitle: body.title,
                    answerContent: body.content,
                    status: AnswerStatus.COMPLETE,
                },
            });
            await prisma.file.createMany({
                data: body.files.map((item) => {
                    return {
                        ...item,
                        reportFile: {
                            create: {
                                answerReportId: report.id,
                            },
                        },
                    };
                }),
            });
        });
    }

    async getList(query: ReportAdminGetListRequest): Promise<ReportAdminGetListResponse> {
        const queryFilter: Prisma.ReportWhereInput = {
            isActive: true,
            isAdminDeleted: false,
            reportType: query.reportType,
            status: query.status,
            createdAt: { gte: query.startDate && new Date(query.startDate), lte: query.endDate && new Date(query.endDate) },
            member: {
                name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive },
            },
        };
        const list = (
            await this.prismaService.report.findMany({
                include: {
                    member: true,
                },
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
                orderBy: {
                    createdAt: Prisma.SortOrder.desc,
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                memberName: item.member.name,
                reportType: item.reportType,
                title: item.questionTitle,
                status: item.status,
                createAt: item.createdAt,
            };
        });
        const total = await this.prismaService.report.count({
            where: queryFilter,
        });
        return new PaginationResponse(list, new PageInfo(total));
    }

    async getDetail(reportId: number): Promise<ReportAdminGetDetailResponse> {
        const report = await this.checkReportExist(reportId);
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
            memberName: report.member.name,
            memberContact: report.member.contact,
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

    async delete(reportIdList: number[]): Promise<void> {
        await Promise.all(
            reportIdList.map(async (item) => {
                await this.checkReportExist(item);
            }),
        );
        await this.prismaService.report.updateMany({
            data: {
                isAdminDeleted: true,
            },
            where: {
                isActive: true,
                isAdminDeleted: false,
                id: { in: reportIdList },
            },
        });
    }
}
