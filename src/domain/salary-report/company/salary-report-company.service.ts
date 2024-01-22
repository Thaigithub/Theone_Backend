import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { SalaryReportCompanyCreateRequest } from './request/salary-report-company-create.request';
import { SalaryReportCompanyGetListResponse } from './response/salary-report-company-get-list.response';
import { SalaryReportCompanyGetListRequest } from './request/salary-report-company-get-list.request';
import { Prisma } from '@prisma/client';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';

@Injectable()
export class SalaryReportCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

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
                if (!siteExist) throw new NotFoundException(`Site with id: ${item} does not exist`);

                const salaryReportExist = await this.prismaService.salaryReport.findUnique({
                    where: {
                        isActive: true,
                        siteId: item,
                        site: {
                            company: {
                                accountId,
                            },
                        },
                    },
                });
                if (salaryReportExist) throw new BadRequestException(`Salary report for site_id: ${item} already existed`);
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
            createdAt: query.requestDate && new Date(query.requestDate),
        };

        const list = (
            await this.prismaService.salaryReport.findMany({
                include: {
                    site: true,
                },
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
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
