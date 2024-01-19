import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RequestObject, SiteStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { ContractStatus } from 'utils/enum/contract-status.enum';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { getSiteStatus } from 'utils/get-site-status';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ContractAdminGetListCategory } from './enum/contract-admin-get-list-category.enum';
import { ContractAdminGetListSort } from './enum/contract-admin-get-list-sort.enum';
import { ContractAdminGetListRequest } from './request/contract-admin-get-list.request';
import { ContractAdminRegistrationRequest } from './request/contract-admin-registration.request';
import { ContractAdminGetDetailContractorResponse } from './response/contract-admin-get-detail-contractor.response';
import { ContractAdminGetDetailResponse } from './response/contract-admin-get-detail.response';
import { ContractAdminGetItemResponse, ContractAdminGetListResponse } from './response/contract-admin-get-list.response';
import { ContractAdminGetTotalContractsResponse } from './response/contract-admin-get-total-contracts.response';

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
            ...(query.category === ContractAdminGetListCategory.ALL && {
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

    async getTotal(query: ContractAdminGetListRequest): Promise<ContractAdminGetTotalContractsResponse> {
        const count = await this.prismaService.site.aggregate({
            _sum: {
                numberOfContract: true,
            },
            where: this.queryFilter(query),
        });

        return { totalContracts: count._sum.numberOfContract } as ContractAdminGetTotalContractsResponse;
    }

    async getDetail(id: number): Promise<ContractAdminGetDetailResponse> {
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

        const detailResponse: ContractAdminGetDetailResponse = {
            siteName: detailSite.name,
            startDate: detailSite.startDate?.toISOString() || null,
            endDate: detailSite.endDate?.toISOString() || null,
            manager: detailSite.personInCharge,
            siteContact: detailSite.contact,
            siteEmail: detailSite.email,
            contractors: detailContractors.map((contractor) => {
                if (contractor.application.member) {
                    const contractorResponse: ContractAdminGetDetailContractorResponse = {
                        object: RequestObject.INDIVIDUAL,
                        name: contractor.application.member.name,
                        leaderName: null,
                        contact: contractor.application.member.contact,
                        contractStartDate: contractor.startDate?.toISOString() || null,
                        contractEndDate: contractor.endDate?.toISOString() || null,
                        contractStatus: this.getStatus(contractor.startDate, contractor.endDate),
                        key: contractor.file?.key || null,
                    };

                    return contractorResponse;
                } else {
                    const contractorResponse: ContractAdminGetDetailContractorResponse = {
                        object: RequestObject.TEAM,
                        name: contractor.application.team.name,
                        leaderName: contractor.application.team.leader.name,
                        contact: contractor.application.team.leader.contact,
                        contractStartDate: contractor.startDate?.toISOString() || null,
                        contractEndDate: contractor.endDate?.toISOString() || null,
                        contractStatus: this.getStatus(contractor.startDate, contractor.endDate),
                        key: contractor.file?.key || null,
                    };

                    return contractorResponse;
                }
            }),
        };

        return detailResponse;
    }

    getStatus(startDate: Date, endDate: Date): ContractStatus {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (startDate <= now && now <= endDate) return ContractStatus.UNDER_CONTRACT;
        if (endDate < now) return ContractStatus.CONTRACT_TERMINATED;
        return null;
    }

    async createFile(id: number, body: ContractAdminRegistrationRequest): Promise<void> {
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

    async update(id: number, body: ContractAdminRegistrationRequest): Promise<void> {
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
}
