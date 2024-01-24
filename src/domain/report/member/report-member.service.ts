import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { ReportMemberCreateRequest } from './request/report-member-create.request';
import { ReportMemberGetListResponse } from './response/report-member-get-list.response';
import { ReportMemberGetListRequest } from './request/report-member-get-list.request';
import { Prisma } from '@prisma/client';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { ReportMemberGetDetailResponse } from './response/report-member-get-detail.response';

@Injectable()
export class ReportMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(accountId: number, body: ReportMemberCreateRequest): Promise<void> {
        await this.prismaService.report.create({
            data: {
                member: {
                    connect: {
                        accountId,
                    },
                },
                questionTitle: body.title,
                questionContent: body.content,
                reportType: body.type,
                questionFile: {
                    create: body.file,
                },
            },
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
                questionFile: true,
                answerFile: true,
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
            questionFile: {
                fileName: report.questionFile?.fileName || null,
                type: report.questionFile?.type || null,
                key: report.questionFile?.key || null,
                size: report.questionFile ? Number(report.questionFile.size) : null,
            },
            reportType: report.reportType,
            createAt: report.createdAt,
            status: report.status,
            answerTitle: report.answerTitle,
            answerContent: report.answerContent,
            answerFile: {
                fileName: report.answerFile?.fileName || null,
                type: report.answerFile?.type || null,
                key: report.answerFile?.key || null,
                size: report.answerFile ? Number(report.answerFile.size) : null,
            },
            answeredAt: report.answeredAt,
        };
    }
}
