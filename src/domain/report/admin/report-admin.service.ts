import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { AnswerStatus, Prisma } from '@prisma/client';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ReportAdminUpdateRequest } from './request/report-admin-update.request';
import { ReportAdminGetListRequest } from './request/report-admin-get-list.request';
import { ReportAdminGetListResponse } from './response/report-admin-get-list.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { ReportAdminGetDetailResponse } from './response/report-admin-get-detail.response';

@Injectable()
export class ReportAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    private async checkReportExist(reportId: number) {
        const report = await this.prismaService.report.findUnique({
            include: {
                member: true,
                questionFile: true,
                answerFile: true,
            },
            where: {
                isActive: true,
                id: reportId,
                isAdminDeleted: false,
            },
        });
        if (!report) throw new NotFoundException(`Report with id: ${reportId} does not exist`);
        return report;
    }

    async update(reportId: number, body: ReportAdminUpdateRequest): Promise<void> {
        await this.checkReportExist(reportId);

        await this.prismaService.report.update({
            where: {
                id: reportId,
            },
            data: {
                answerTitle: body.title,
                answerContent: body.content,
                answerFile: {
                    create: body.file,
                },
                status: AnswerStatus.COMPLETE,
            },
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
            questionFile: {
                fileName: report.questionFile?.fileName || null,
                type: report.questionFile?.type || null,
                key: report.questionFile?.key || null,
                size: report.questionFile ? Number(report.questionFile.size) : null,
            },
            reportType: report.reportType,
            createAt: report.createdAt,
            status: report.status,
            memberName: report.member.name,
            memberContact: report.member.contact,
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