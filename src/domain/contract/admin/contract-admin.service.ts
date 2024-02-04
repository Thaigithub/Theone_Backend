import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SiteStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { CountResponse } from 'utils/generics/count.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { SitePeriodStatus, getSiteStatus } from 'utils/get-site-status';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ContractAdminCountCategory } from './enum/contract-admin-get-count-category.enum';
import { ContractAdminGetListCategory } from './enum/contract-admin-get-list-category.enum';
import { ContractAdminGetListSort } from './enum/contract-admin-get-list-sort.enum';
import { ContractAdminGetListStatus } from './enum/contract-admin-get-list-status.enum';
import { ContractAdminGetCountRequest } from './request/contract-admin-get-count.request';
import { ContractAdminGetListRequest } from './request/contract-admin-get-list.request';
import { ContractAdminUpsertFileRequest } from './request/contract-admin-upsert-file.request';
import { ContractAdminGetItemResponse, ContractAdminGetListResponse } from './response/contract-admin-get-list.response';

@Injectable()
export class ContractAdminService {
    constructor(private prismaService: PrismaService) {}

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

    async getCount(query: ContractAdminGetCountRequest): Promise<CountResponse> {
        const queryFilter: Prisma.ContractWhereInput = {
            ...(query.category === ContractAdminCountCategory.UNDER_CONTRACT && {
                endDate: { gte: new Date() },
                startDate: { lte: new Date() },
            }),
            ...(query.category === ContractAdminCountCategory.CONTRACT_EXPIRED && {
                endDate: { lt: new Date() },
            }),
        };
        const count = await this.prismaService.contract.count({
            where: queryFilter,
        });

        return {
            count: count,
        };
    }

    getStatus(startDate: Date, endDate: Date): ContractAdminGetListStatus {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (startDate <= now && now <= endDate) return ContractAdminGetListStatus.UNDER_CONTRACT;
        if (endDate < now) return ContractAdminGetListStatus.CONTRACT_TERMINATED;
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
            throw new NotFoundException(Error.CONTRACT_NOT_FOUND);
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
            throw new NotFoundException(Error.CONTRACT_NOT_FOUND);
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
