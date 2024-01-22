import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationCategory, Prisma, RequestObject, SiteStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { SitePeriodStatus, getSiteStatus } from 'utils/get-site-status';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ContractAdminGetListCategory } from './enum/contract-admin-get-list-category.enum';
import { ContractAdminGetListSort } from './enum/contract-admin-get-list-sort.enum';
import { ContractAdminStatus } from './enum/contract-admin-status.enum';
import { ContractAdminGetListSettlementRequest } from './request/contract-admin-get-list-settlement.request';
import { ContractAdminGetListRequest } from './request/contract-admin-get-list.request';
import { ContractAdminUpdateSettlementStatusRequest } from './request/contract-admin-update-settlement-status.request';
import { ContractAdminUpsertFileRequest } from './request/contract-admin-upsert-file.request';
import { ContractAdminGetDetailSettlementResponse } from './response/contract-admin-get-detail-settlement.response';
import { ContractAdminGetListSettlementResponse } from './response/contract-admin-get-list-settlement.response';
import { ContractAdminGetItemResponse, ContractAdminGetListResponse } from './response/contract-admin-get-list.response';
import { ContractAdminGetTotalResponse } from './response/contract-admin-get-total.response';

@Injectable()
export class ContractAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    queryFilter(query: ContractAdminGetListRequest): Prisma.SiteWhereInput {
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
            ...(query.category === ContractAdminGetListCategory.COMPANY_NAME && {
                company: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            }),
            ...(query.category === ContractAdminGetListCategory.SITE_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(!query.category && {
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

    async getList(query: ContractAdminGetListRequest): Promise<ContractAdminGetListResponse> {
        const lists = await this.prismaService.site.findMany({
            select: {
                id: true,
                name: true,
                company: {
                    select: {
                        name: true,
                    },
                },
                numberOfContract: true,
                startDate: true,
                endDate: true,
                status: true,
            },
            where: this.queryFilter(query),
            orderBy: {
                ...(query.numberOfContracts && {
                    numberOfContract: ContractAdminGetListSort[query.numberOfContracts],
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

        const listResponse: ContractAdminGetItemResponse[] = lists.map((list) => {
            return {
                id: list.id,
                companyName: list.company.name,
                siteName: list.name,
                numberOfContracts: list.numberOfContract,
                status: getSiteStatus(list.status, list.startDate, list.endDate),
            } as ContractAdminGetItemResponse;
        });

        return new PaginationResponse(listResponse, new PageInfo(count));
    }

    async getTotal(query: ContractAdminGetListRequest): Promise<ContractAdminGetTotalResponse> {
        const count = await this.prismaService.site.aggregate({
            _sum: {
                numberOfContract: true,
            },
            where: this.queryFilter(query),
        });

        return { totalContracts: count._sum.numberOfContract };
    }

    getStatus(startDate: Date, endDate: Date): ContractAdminStatus {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (startDate <= now && now <= endDate) return ContractAdminStatus.UNDER_CONTRACT;
        if (endDate < now) return ContractAdminStatus.CONTRACT_TERMINATED;
        return null;
    }

    async createFile(id: number, body: ContractAdminUpsertFileRequest): Promise<void> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id,
            },
            include: {
                file: true,
            },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        await this.prismaService.contract.update({
            where: { id },
            data: {
                file: {
                    create: { size: body.size, type: body.type, key: body.key, fileName: body.fileName },
                },
            },
        });
    }

    async updateFile(id: number, body: ContractAdminUpsertFileRequest): Promise<void> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id,
            },
            include: {
                file: true,
            },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        await this.prismaService.file.update({
            where: { id: contract.fileId },
            data: {
                size: body.size,
                type: body.type,
                key: body.key,
                fileName: body.fileName,
            },
        });
    }

    async getListSettlement(query: ContractAdminGetListSettlementRequest): Promise<ContractAdminGetListSettlementResponse> {
        const search = {
            where: {
                settlementStatus: query.status,
                application: {
                    category: ApplicationCategory.HEADHUNTING,
                    NOT: {
                        team: query.type && (query.type === RequestObject.TEAM ? null : undefined),
                        member: query.type && (query.type === RequestObject.INDIVIDUAL ? null : undefined),
                    },
                    ...(query.category
                        ? query.category === RequestObject.TEAM
                            ? { team: { name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive } } }
                            : { member: { name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive } } }
                        : {
                              OR: [
                                  { team: { name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive } } },
                                  { member: { name: { contains: query.keyword, mode: Prisma.QueryMode.insensitive } } },
                              ],
                          }),
                },
                settlementRequestDate: query.requestDate && new Date(query.requestDate),
            },
            ...QueryPagingHelper.queryPaging(query),
            select: {
                id: true,
                application: {
                    select: {
                        team: {
                            select: {
                                name: true,
                                leader: {
                                    select: {
                                        contact: true,
                                    },
                                },
                            },
                        },
                        member: true,
                    },
                },
                settlementRequestDate: true,
                settlementCompleteDate: true,
                settlementStatus: true,
            },
        };
        const contract = (await this.prismaService.contract.findMany(search)).map((item) => {
            return {
                type: item.application.member ? RequestObject.INDIVIDUAL : RequestObject.TEAM,
                name: item.application.member?.name || item.application.team.name,
                contact: item.application.member?.contact || item.application.team.leader.contact,
                requestDate: item.settlementRequestDate,
                status: item.settlementStatus,
                completeDate: item.settlementCompleteDate || null,
            };
        });
        const total = await this.prismaService.contract.count({ where: search.where });
        return new PaginationResponse(contract, new PageInfo(total));
    }

    async getDetailSettlement(id: number): Promise<ContractAdminGetDetailSettlementResponse> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id,
                application: {
                    category: ApplicationCategory.HEADHUNTING,
                },
            },
            select: {
                startDate: true,
                endDate: true,
                labor: {
                    select: {
                        workDates: true,
                        salaryHistories: true,
                    },
                },
                application: {
                    select: {
                        team: {
                            select: {
                                leader: {
                                    select: {
                                        name: true,
                                        contact: true,
                                    },
                                },
                                name: true,
                            },
                        },
                        member: {
                            select: {
                                name: true,
                                contact: true,
                            },
                        },
                        post: {
                            select: {
                                site: true,
                            },
                        },
                    },
                },
            },
        });
        if (!contract) throw new NotFoundException('Settlement not found');
        return {
            siteName: contract.application.post.site.name,
            siteStartDate: contract.application.post.site.startDate,
            siteEndDate: contract.application.post.site.endDate,
            contractStartDate: contract.startDate,
            contractEndDate: contract.endDate,
            contractstatus: this.getStatus(contract.startDate, contract.endDate),
            workDate: contract.labor.workDates.map((item) => {
                return { date: item.date, hour: item.hours };
            }),
            numberOfWorkDate: contract.labor.workDates.length,
            numberOfWorkHour: contract.labor.workDates.reduce((accum, current) => {
                return accum + current.hours;
            }, 0),
            wage: contract.labor.salaryHistories.reduce((accum, current) => {
                return accum + current.base;
            }, 0),
            deductible: contract.labor.salaryHistories.reduce((accum, current) => {
                return accum + current.totalDeductible;
            }, 0),
            actual: contract.labor.salaryHistories.reduce((accum, current) => {
                return accum + current.actualPayment;
            }, 0),
            member: contract.application.member
                ? {
                      name: contract.application.member.name,
                      contact: contract.application.member.contact,
                  }
                : null,
            team: contract.application.team
                ? {
                      name: contract.application.team.name,
                      leaderName: contract.application.team.leader.name,
                      contact: contract.application.team.leader.contact,
                  }
                : null,
        };
    }

    async updateSettlementStatus(id: number, body: ContractAdminUpdateSettlementStatusRequest): Promise<void> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id,
                application: {
                    category: ApplicationCategory.HEADHUNTING,
                },
            },
        });
        if (!contract) throw new NotFoundException('Settlement not found');
        await this.prismaService.contract.update({
            where: {
                id,
            },
            data: {
                settlementStatus: body.status,
                settlementCompleteDate: new Date(),
            },
        });
    }
}
