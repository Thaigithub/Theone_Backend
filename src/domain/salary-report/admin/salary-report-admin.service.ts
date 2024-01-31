import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SalaryReportAdminSearchCategory } from './enum/salary-report-admin-search-category.enum';
import { SalaryReportAdminGetListRequest } from './request/salary-report-admin-get-list.request';
import { SalaryReportAdminGetListResponse } from './response/salary-report-admin-get-list.response';

@Injectable()
export class SalaryReportAdminService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: SalaryReportAdminGetListRequest): Promise<SalaryReportAdminGetListResponse> {
        const queryFilter: Prisma.SalaryReportWhereInput = {
            isActive: true,
            isAdminDeleted: false,
            createdAt: {
                gte: query.startDate && new Date(query.startDate),
                lte: query.endDate && new Date(query.endDate),
            },
            ...(query.category === SalaryReportAdminSearchCategory.COMPANY_NAME && {
                site: { company: { name: { contains: query.keyword, mode: 'insensitive' } } },
            }),
            ...(query.category === SalaryReportAdminSearchCategory.SITE_NAME && {
                site: { name: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === SalaryReportAdminSearchCategory.CONTACT && {
                site: { contact: { contains: query.keyword, mode: 'insensitive' } },
            }),
        };

        const list = (
            await this.prismaService.salaryReport.findMany({
                include: {
                    site: {
                        include: {
                            company: true,
                        },
                    },
                },
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                companyName: item.site.company.name,
                siteName: item.site.name,
                contact: item.site.contact,
                requestDate: item.createdAt.toISOString().split('T')[0],
            };
        });

        const total = await this.prismaService.salaryReport.count({
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(total));
    }

    async delete(salaryReporteportIdList: number[]): Promise<void> {
        await Promise.all(
            salaryReporteportIdList.map(async (item) => {
                const salaryReport = await this.prismaService.salaryReport.findUnique({
                    where: {
                        isActive: true,
                        id: item,
                        isAdminDeleted: false,
                    },
                });
                if (!salaryReport) throw new NotFoundException(`Salary Report with id: ${item} does not exist`);
            }),
        );
        await this.prismaService.salaryReport.updateMany({
            data: {
                isAdminDeleted: true,
            },
            where: {
                isActive: true,
                isAdminDeleted: false,
                id: { in: salaryReporteportIdList },
            },
        });
    }
}
