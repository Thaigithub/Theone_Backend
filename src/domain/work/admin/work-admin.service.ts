import { Injectable } from '@nestjs/common';
import { Prisma, SiteStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { getSiteStatus } from 'utils/get-site-status';
import { QueryPagingHelper } from 'utils/pagination-query';
import { WorkAdminGetListCategory } from './dto/work-admin-get-list-category.enum';
import { WorkAdminGetListSort } from './dto/work-admin-get-list-sort.enum';
import { WorkAdminGetDetailListHistoryRequest } from './request/work-admin-get-detail-list-history.request';
import { WorkAdminGetListRequest } from './request/work-admin-get-list.request';
import { WorkAdminGetDetailListHistoryResponse } from './response/work-admin-get-detail-list-history.response';
import { WorkAdminGetDetailSiteResponse } from './response/work-admin-get-detail-site.response';
import { WorkAdminGetItemResponse, WorkAdminGetListResponse } from './response/work-admin-get-list.response';
import { WorkerAdminGetTotalWorkersResponse } from './response/work-admin-get-total-workers.response';

@Injectable()
export class WorkAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    queryFilter(query: WorkAdminGetListRequest): Prisma.SiteWhereInput {
        return {
            isActive: true,
            ...(query.siteStatus === SitePeriodStatus.REVIEWING && {
                status: SiteStatus[query.siteStatus],
            }),
            ...(query.siteStatus === SitePeriodStatus.REJECTED && {
                status: SiteStatus[query.siteStatus],
            }),
            ...(query.siteStatus === SitePeriodStatus.APPROVED && {
                status: SiteStatus[query.siteStatus],
            }),
            ...(query.siteStatus === SitePeriodStatus.PREPARE && {
                AND: [{ status: SiteStatus.APPROVED }, { startDate: { gt: new Date() } }],
            }),
            ...(query.siteStatus === SitePeriodStatus.PROCEEDING && {
                AND: [{ status: SiteStatus.APPROVED }, { startDate: { lte: new Date() } }, { endDate: { gte: new Date() } }],
            }),
            ...(query.siteStatus === SitePeriodStatus.END && {
                AND: [{ status: SiteStatus.APPROVED }, { endDate: { lt: new Date() } }],
            }),
            ...(query.category === WorkAdminGetListCategory.COMPANY_NAME && {
                company: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
            ...(query.category === WorkAdminGetListCategory.SITE_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === WorkAdminGetListCategory.ALL && {
                OR: [
                    {
                        name: { contains: query.keyword, mode: 'insensitive' },
                    },
                    {
                        company: {
                            name: { contains: query.keyword, mode: 'insensitive' },
                        },
                    },
                ],
            }),
        };
    }

    async getList(query: WorkAdminGetListRequest): Promise<WorkAdminGetListResponse> {
        const lists = await this.prismaService.site.findMany({
            select: {
                id: true,
                name: true,
                status: true,
                company: {
                    select: {
                        name: true,
                    },
                },
                numberOfWorkers: true,
                startDate: true,
                endDate: true,
            },
            where: this.queryFilter(query),
            orderBy: {
                ...(query.numberOfWorkers && {
                    numberOfWorkers: WorkAdminGetListSort[query.numberOfWorkers],
                }),
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const count = await this.prismaService.site.count({
            // Conditions based on request query
            where: this.queryFilter(query),
        });

        const listResponse: WorkAdminGetItemResponse[] = lists.map((list) => {
            return {
                companyName: list.company.name,
                siteName: list.name,
                numberOfWorkers: list.numberOfWorkers,
                status: getSiteStatus(list.status, list.startDate, list.endDate),
            } as WorkAdminGetItemResponse;
        });

        return new PaginationResponse(listResponse, new PageInfo(count));
    }

    async getTotalWorkers(query: WorkAdminGetListRequest): Promise<WorkerAdminGetTotalWorkersResponse> {
        const count = await this.prismaService.site.aggregate({
            _sum: {
                numberOfWorkers: true,
            },
            where: this.queryFilter(query),
        });

        return { totalWorkers: count._sum.numberOfWorkers } as WorkerAdminGetTotalWorkersResponse;
    }

    async getDetailSite(id: number): Promise<WorkAdminGetDetailSiteResponse> {
        const detailSite = await this.prismaService.site.findUnique({
            where: {
                id,
                isActive: true,
            },
            select: {
                name: true,
                startDate: true,
                endDate: true,
                personInCharge: true,
                contact: true,
                email: true,
                address: true,
                personInChargeContact: true,
            },
        });

        const detailResponse: WorkAdminGetDetailSiteResponse = {
            siteName: detailSite.name,
            startDate: detailSite.startDate?.toISOString() || null,
            endDate: detailSite.endDate?.toISOString() || null,
            siteAddress: detailSite.address,
            siteContact: detailSite.contact,
            manager: detailSite.personInCharge,
            managerContact: detailSite.personInChargeContact,
        };

        return detailResponse;
    }

    async getDetailHistory(
        id: number,
        query: WorkAdminGetDetailListHistoryRequest,
    ): Promise<WorkAdminGetDetailListHistoryResponse> {
        return;
    }
}
