import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { SalaryReportAdminGetListRequest } from './request/salary-report-admin-get-list.request';
import { Prisma } from '@prisma/client';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { SalaryReportAdminGetListResponse } from './response/salary-report-admin-get-list.response';
import { SalaryReportAdminSearchCategory } from './enum/salary-report-admin-search-category.enum';

@Injectable()
export class SalaryReportAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: SalaryReportAdminGetListRequest): Promise<SalaryReportAdminGetListResponse> {
        const queryFilter: Prisma.SalaryReportWhereInput = {
            isActive: true,
            createdAt: query.requestDate && new Date(query.requestDate),
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
}
