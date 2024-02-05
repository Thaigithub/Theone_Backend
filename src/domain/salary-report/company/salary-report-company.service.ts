import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SalaryReportCompanyCreateRequest } from './request/salary-report-company-create.request';
import { SalaryReportCompanyGetListRequest } from './request/salary-report-company-get-list.request';
import { SalaryReportCompanyGetListResponse } from './response/salary-report-company-get-list.response';

@Injectable()
export class SalaryReportCompanyService {
    constructor(private prismaService: PrismaService) {}

    async requestSalaryReport(accountId: number, body: SalaryReportCompanyCreateRequest): Promise<void> {
        await Promise.all(
            body.siteIdList.map(async (item) => {
                const siteExist = await this.prismaService.site.findUnique({
                    where: {
                        isActive: true,
                        id: item,
                        company: {
                            accountId,
                        },
                    },
                });
                if (!siteExist) throw new NotFoundException(Error.SITE_NOT_FOUND);
            }),
        );
        await this.prismaService.salaryReport.createMany({
            data: body.siteIdList.map((item) => {
                return {
                    siteId: item,
                };
            }),
        });
    }

    async getList(accountId: number, query: SalaryReportCompanyGetListRequest): Promise<SalaryReportCompanyGetListResponse> {
        const queryFilter: Prisma.SalaryReportWhereInput = {
            isActive: true,
            site: {
                company: {
                    accountId,
                },
            },
            createdAt: {
                gte: query.startDate && new Date(query.startDate),
                lte: query.endDate && new Date(query.endDate),
            },
        };

        const list = (
            await this.prismaService.salaryReport.findMany({
                include: {
                    site: true,
                },
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
                orderBy: {
                    createdAt: Prisma.SortOrder.desc,
                },
            })
        ).map((item) => {
            return {
                siteName: item.site.name,
                requestDate: item.createdAt.toISOString().split('T')[0],
            };
        });

        const total = await this.prismaService.salaryReport.count({
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(total));
    }
}
