/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType, Prisma, RequestObject, SiteStatus } from '@prisma/client';
import { NotificationCompanyService } from 'domain/notification/company/notification-company.service';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { CountResponse } from 'utils/generics/count.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { SitePeriodStatus, getSiteStatus } from 'utils/get-site-status';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteAdminGetCountCategory } from './enum/site-admin-get-count-category.enum';
import { SiteAdminGetListCategory } from './enum/site-admin-get-list-category.enum';
import { SiteAdminGetListLaborCategory } from './enum/site-admin-get_list-labor-category.enum';
import { SiteAdminGetDetailContractStatus } from './enum/stie-admin-get-detail-contract-status.enum';
import { SiteAdminGetCountRequest } from './request/site-admin-get-count.request';
import { SiteAdminGetListLaborRequest } from './request/site-admin-get-list-labor.request';
import { SiteAdminGetListRequest } from './request/site-admin-get-list.request';
import { SiteAdminUpdateRequest } from './request/site-admin-update-status.request';
import { SiteAdminGetDetailContractResponse } from './response/site-admin-get-detail-contract.response';
import { SiteAdminGetDetailLaborResponse } from './response/site-admin-get-detail-labor.response';
import { SiteAdminGetDetailResponse } from './response/site-admin-get-detail.response';
import { SiteAdminGetListLaborResponse } from './response/site-admin-get-list-labor.response';
import { SiteAdminGetListResponse } from './response/site-admin-get-list.response';

@Injectable()
export class SiteAdminService {
    constructor(
        private prismaService: PrismaService,
        private excelService: ExcelService,
        private notificationCompanyService: NotificationCompanyService,
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
        const item = await this.prismaService.site.findUnique({
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
                region: {
                    select: {
                        districtEnglishName: true,
                        districtKoreanName: true,
                        cityEnglishName: true,
                        cityKoreanName: true,
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
        const site = {
            company: {
                name: item.company.name,
            },
            siteManagementNumber: item.siteManagementNumber,
            name: item.name,
            address: item.address,
            district: {
                koreanName: item.region.districtKoreanName,
                englishName: item.region.districtEnglishName,
                city: {
                    koreanName: item.region.cityKoreanName,
                    englishName: item.region.cityEnglishName,
                },
            },
            contact: item.contact,
            personInCharge: item.personInCharge,
            personInChargeContact: item.personInChargeContact,
            email: item.email,
            taxInvoiceEmail: item.taxInvoiceEmail,
            startDate: item.startDate,
            endDate: item.endDate,
            contractStatus: item.contractStatus,
            status: item.status,
        };
        if (!site) {
            throw new NotFoundException(Error.SITE_NOT_FOUND);
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
                const site = await prisma.site.update({
                    where: {
                        id: id,
                        isActive: true,
                    },
                    data: {
                        status: body.status,
                    },
                    select: {
                        company: {
                            select: {
                                accountId: true,
                            }
                        }
                    }
                });
                if (body.status === SiteStatus.SUSPENDED) {
                    if (!body.content) {
                        throw new BadRequestException(Error.REASON_IS_REQUIRED);
                    }
                    await prisma.siteHistory.create({
                        data: {
                            content: body.content,
                            siteId: id,
                        },
                    });
                    await this.notificationCompanyService.create(
                        site.company.accountId, 
                        '관리자가 현장을 정지시켰습니다.', 
                        '', 
                        NotificationType.SITE, 
                        id
                    );
                }
            });
        }
    }

    async getCount(query: SiteAdminGetCountRequest): Promise<CountResponse> {
        const queryFilter: Prisma.SiteWhereInput = {
            isActive: true,
            ...(query.category === SiteAdminGetCountCategory.IN_PROGRESS && {
                status: SiteStatus.APPROVED,
                AND: [{ startDate: { lte: new Date() } }, { endDate: { gte: new Date() } }],
            }),
            ...(query.category === SiteAdminGetCountCategory.CLOSED && {
                endDate: { lte: new Date() },
            }),
        };
        const count = await this.prismaService.site.count({
            where: queryFilter,
        });
        return {
            count: count,
        };
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

    async getDetailContract(id: number): Promise<SiteAdminGetDetailContractResponse> {
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
            },
        });
        if (!detailSite) throw new NotFoundException(Error.SITE_NOT_FOUND);
        const detailContractors = await this.prismaService.contract.findMany({
            where: {
                application: {
                    post: {
                        isActive: true,
                        siteId: id,
                    },
                },
            },
            select: {
                startDate: true,
                endDate: true,
                application: {
                    select: {
                        member: {
                            select: {
                                name: true,
                                contact: true,
                            },
                        },
                        team: {
                            select: {
                                name: true,
                                leader: {
                                    select: {
                                        name: true,
                                        contact: true,
                                    },
                                },
                            },
                        },
                    },
                },
                file: {
                    select: {
                        key: true,
                    },
                },
            },
        });

        const detailResponse = {
            siteName: detailSite.name,
            startDate: detailSite.startDate?.toISOString() || null,
            endDate: detailSite.endDate?.toISOString() || null,
            manager: detailSite.personInCharge,
            siteContact: detailSite.contact,
            siteEmail: detailSite.email,
            contractors: detailContractors.map((contractor) => {
                if (contractor.application.member) {
                    const contractorResponse = {
                        object: RequestObject.INDIVIDUAL,
                        name: contractor.application.member.name,
                        leaderName: null,
                        contact: contractor.application.member.contact,
                        contractStartDate: contractor.startDate?.toISOString() || null,
                        contractEndDate: contractor.endDate?.toISOString() || null,
                        contractStatus: this.getStatusContract(contractor.startDate, contractor.endDate),
                        key: contractor.file?.key || null,
                    };

                    return contractorResponse;
                } else {
                    const contractorResponse = {
                        object: RequestObject.TEAM,
                        name: contractor.application.team.name,
                        leaderName: contractor.application.team.leader.name,
                        contact: contractor.application.team.leader.contact,
                        contractStartDate: contractor.startDate?.toISOString() || null,
                        contractEndDate: contractor.endDate?.toISOString() || null,
                        contractStatus: this.getStatusContract(contractor.startDate, contractor.endDate),
                        key: contractor.file?.key || null,
                    };

                    return contractorResponse;
                }
            }),
        };

        return detailResponse;
    }

    getStatusContract(startDate: Date, endDate: Date): SiteAdminGetDetailContractStatus {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (startDate <= now && now <= endDate) return SiteAdminGetDetailContractStatus.UNDER_CONTRACT;
        if (endDate < now) return SiteAdminGetDetailContractStatus.CONTRACT_TERMINATED;
        return null;
    }
}
