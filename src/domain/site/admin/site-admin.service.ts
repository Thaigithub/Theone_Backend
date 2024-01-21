import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SiteStatus } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { SitePeriodStatus, getSiteStatus } from 'utils/get-site-status';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteAdminGetListCategory } from './enum/site-admin-get-list-category.enum';
import { SiteAdminGetListLaborCategory } from './enum/site-admin-get_list-labor-category.enum';
import { SiteAdminGetListLaborRequest } from './request/site-admin-get-list-labor.request';
import { SiteAdminGetListRequest } from './request/site-admin-get-list.request';
import { SiteAdminUpdateRequest } from './request/site-admin-update-status.request';
import { SiteAdminGetDetailLaborResponse } from './response/site-admin-get-detail-labor.response';
import { SiteAdminGetDetailResponse } from './response/site-admin-get-detail.response';
import { SiteAdminGetListLaborResponse } from './response/site-admin-get-list-labor.response';
import { SiteAdminGetListResponse } from './response/site-admin-get-list.response';

@Injectable()
export class SiteAdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}

    async getList(query: SiteAdminGetListRequest): Promise<SiteAdminGetListResponse> {
        const queryFilter: Prisma.SiteWhereInput = {
            isActive: true,
            ...(query.contractStatus && { contractStatus: query.contractStatus }),
            ...(query.startDate && { startDate: { gte: new Date(query.startDate).toISOString() } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate).toISOString() } }),
            ...(!query.category && query.searchKeyword
                ? {
                      OR: [
                          { name: { contains: query.searchKeyword, mode: 'insensitive' } },
                          { company: { name: { contains: query.searchKeyword, mode: 'insensitive' } } },
                          { personInCharge: { contains: query.searchKeyword, mode: 'insensitive' } },
                      ],
                  }
                : {}),
            ...(query.category == SiteAdminGetListCategory.SITE_NAME && {
                name: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
            ...(query.category == SiteAdminGetListCategory.COMPANY_NAME && {
                company: { name: { contains: query.searchKeyword, mode: 'insensitive' } },
            }),
            ...(query.category == SiteAdminGetListCategory.REPRESENTATIVE_NAME && {
                personInCharge: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
        };
        const sites = await this.prismaService.site.findMany({
            where: queryFilter,
            select: {
                id: true,
                name: true,
                contact: true,
                personInChargeContact: true,
                contractStatus: true,
                startDate: true,
                endDate: true,
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const count = await this.prismaService.site.count({
            where: queryFilter,
        });
        return new PaginationResponse(sites, new PageInfo(count));
    }

    async getDetail(id: number): Promise<SiteAdminGetDetailResponse> {
        const site = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
                company: {
                    isActive: true,
                },
            },
            select: {
                company: {
                    select: {
                        name: true,
                    },
                },
                siteManagementNumber: true,
                name: true,
                address: true,
                district: {
                    select: {
                        koreanName: true,
                        englishName: true,
                        city: {
                            select: {
                                koreanName: true,
                                englishName: true,
                            },
                        },
                    },
                },
                contact: true,
                personInCharge: true,
                personInChargeContact: true,
                email: true,
                taxInvoiceEmail: true,
                startDate: true,
                endDate: true,
                contractStatus: true,
                status: true,
            },
        });
        if (!site) {
            throw new NotFoundException('The site id is not exist');
        }
        return site;
    }

    async updateStatus(id: number, body: SiteAdminUpdateRequest) {
        const site = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                status: true,
            },
        });
        if (site.status !== body.status) {
            await this.prismaService.$transaction(async (prisma) => {
                await prisma.site.update({
                    where: {
                        id: id,
                        isActive: true,
                    },
                    data: {
                        status: body.status,
                    },
                });
                if (body.status === SiteStatus.SUSPENDED) {
                    if (!body.content) {
                        throw new BadRequestException('The reason for suspend must be filled');
                    }
                    await prisma.siteHistory.create({
                        data: {
                            content: body.content,
                            siteId: id,
                        },
                    });
                }
            });
        }
    }

    async download(query: number[], response: Response): Promise<void> {
        const ids = query.filter((element) => typeof element === 'number' && !isNaN(element));
        const sites = await this.prismaService.site.findMany({
            where: {
                id: { in: ids },
                isActive: true,
            },
            select: {
                name: true,
                contact: true,
                personInChargeContact: true,
                contractStatus: true,
                startDate: true,
                endDate: true,
            },
        });
        const excelStream = await await this.excelService.createExcelFile(sites, null);
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', `attachment; filename=SiteManagement.xlsx`);
        excelStream.pipe(response);
    }

    async getListLabor(query: SiteAdminGetListLaborRequest): Promise<SiteAdminGetListLaborResponse> {
        const search = {
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
            where: {
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
                ...(query.category === SiteAdminGetListLaborCategory.COMPANY_NAME && {
                    company: {
                        name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive },
                    },
                }),
                ...(query.category === SiteAdminGetListLaborCategory.SITE_NAME && {
                    name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive },
                }),
                ...(!query.category && {
                    OR: [
                        {
                            name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive },
                        },
                        {
                            company: {
                                name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive },
                            },
                        },
                    ],
                }),
            },
            orderBy: {
                ...(query.numberOfWorkers && {
                    numberOfWorkers: SiteAdminGetListLaborCategory[query.numberOfWorkers],
                }),
            },
            ...QueryPagingHelper.queryPaging(query),
        };
        const lists = (await this.prismaService.site.findMany(search)).map((list) => {
            return {
                id: list.id,
                companyName: list.company.name,
                siteName: list.name,
                numberOfWorkers: list.numberOfWorkers,
                status: getSiteStatus(list.status, list.startDate, list.endDate),
            };
        });

        const count = await this.prismaService.site.count({
            where: search.where,
        });

        return new PaginationResponse(lists, new PageInfo(count));
    }

    async getDetailLabor(id: number): Promise<SiteAdminGetDetailLaborResponse> {
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
        return {
            siteName: detailSite.name,
            startDate: detailSite.startDate?.toISOString() || null,
            endDate: detailSite.endDate?.toISOString() || null,
            siteAddress: detailSite.address,
            siteContact: detailSite.contact,
            manager: detailSite.personInCharge,
            managerContact: detailSite.personInChargeContact,
        };
    }
}
