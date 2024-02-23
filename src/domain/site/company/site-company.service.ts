import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteCompanyGetListStatus } from './enum/site-company-get-list-status.enum';
import { SiteCompanyGetListContractRequest } from './request/site-company-get-list-contract.request';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';
import { SiteCompanyUpsertRequest } from './request/site-company-upsert.request';
import { SiteCompanyGetDetailResponse } from './response/site-company-get-detail.response';
import { SiteCompanyGetListContractResponse } from './response/site-company-get-list-contract.response';
import { SiteCompanyGetListResponse } from './response/site-company-get-list.response';

@Injectable()
export class SiteCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: SiteCompanyGetListRequest, accountId: number): Promise<SiteCompanyGetListResponse> {
        const queryFilter: Prisma.SiteWhereInput = {
            isActive: true,
            company: {
                accountId,
            },
            ...(query.progressStatus === SiteCompanyGetListStatus.WAITING && {
                startDate: { gt: new Date() },
            }),
            ...(query.progressStatus === SiteCompanyGetListStatus.IN_PROGRESS && {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            }),
            ...(query.progressStatus === SiteCompanyGetListStatus.END && {
                endDate: { lt: new Date() },
            }),
        };
        const sites = (
            await this.prismaService.site.findMany({
                where: queryFilter,
                include: {
                    region: {
                        select: {
                            cityKoreanName: true,
                            cityEnglishName: true,
                            districtKoreanName: true,
                            districtEnglishName: true,
                        },
                    },
                    company: {
                        include: {
                            logo: {
                                select: {
                                    fileName: true,
                                    key: true,
                                    size: true,
                                    type: true,
                                },
                            },
                        },
                    },
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.name,
                personInCharge: item.personInCharge,
                personInChargeContact: item.personInChargeContact,
                startDate: item.startDate,
                endDate: item.endDate,
                cityKoreanName: item.region?.cityKoreanName || null,
                cityEnglishName: item.region?.cityEnglishName || null,
                districtKoreanName: item.region?.districtKoreanName || null,
                districtEnglishName: item.region?.districtEnglishName || null,
                companyLogoKey: item.company.logo ? item.company.logo.key : null,
            };
        });
        const count = await this.prismaService.site.count({ where: queryFilter });
        return new PaginationResponse(sites, new PageInfo(count));
    }

    async getDetail(id: number, accountId: number): Promise<SiteCompanyGetDetailResponse> {
        const siteExist = await this.prismaService.site.count({
            where: {
                isActive: true,
                id,
                company: {
                    accountId,
                },
            },
        });
        if (!siteExist) throw new NotFoundException(Error.SITE_NOT_FOUND);

        const site = await this.prismaService.site.findUnique({
            include: {
                region: {
                    select: {
                        id: true,
                        cityKoreanName: true,
                        districtKoreanName: true,
                    },
                },
            },
            where: {
                isActive: true,
                id,
                company: {
                    accountId,
                },
            },
        });
        return {
            id: site.id,
            name: site.name,
            address: site.address,
            contact: site.contact,
            personInCharge: site.personInCharge,
            personInChargeContact: site.personInChargeContact,
            email: site.email,
            taxInvoiceEmail: site.taxInvoiceEmail,
            siteManagementNumber: site.siteManagementNumber,
            contractStatus: site.contractStatus,
            startDate: site.startDate,
            endDate: site.endDate,
            longitude: site.longitude,
            latitude: site.latitude,
            city: site.region.id,
            district: site.region.id,
            cityKorean: site.region.cityKoreanName,
            districtKorean: site.region.districtKoreanName,
        };
    }

    async create(body: SiteCompanyUpsertRequest, accountId: number): Promise<void> {
        const company = await this.prismaService.company.findUnique({
            select: {
                id: true,
            },
            where: {
                isActive: true,
                accountId,
            },
        });
        const companyId = company.id;
        body.startDate = new Date(body.startDate).toISOString();
        body.endDate = new Date(body.endDate).toISOString();
        await this.prismaService.site.create({
            data: {
                name: body.name,
                address: body.address,
                region: {
                    connect: { id: body.districtId },
                },
                contact: body.contact,
                personInCharge: body.personInCharge,
                personInChargeContact: body.personInChargeContact,
                email: body.email,
                taxInvoiceEmail: body.taxInvoiceEmail,
                siteManagementNumber: body.siteManagementNumber,
                contractStatus: body.contractStatus,
                longitude: body.longitude,
                latitude: body.latitude,
                startDate: body.startDate,
                endDate: body.endDate,
                company: {
                    connect: { id: companyId },
                },
            },
        });
    }

    async update(id: number, body: SiteCompanyUpsertRequest, accountId: number): Promise<void> {
        const siteExist = await this.prismaService.site.count({
            where: {
                isActive: true,
                id,
                company: {
                    accountId,
                },
            },
        });
        if (!siteExist) throw new NotFoundException(Error.SITE_NOT_FOUND);

        if (body.startDate) body.startDate = new Date(body.startDate).toISOString();
        if (body.endDate) body.endDate = new Date(body.endDate).toISOString();
        await this.prismaService.site.update({
            where: {
                isActive: true,
                id,
                company: {
                    accountId,
                },
            },
            data: {
                name: body.name,
                address: body.address,
                regionId: body.districtId,
                contact: body.contact,
                personInCharge: body.personInCharge,
                personInChargeContact: body.personInChargeContact,
                email: body.email,
                taxInvoiceEmail: body.taxInvoiceEmail,
                siteManagementNumber: body.siteManagementNumber,
                contractStatus: body.contractStatus,
                longitude: body.longitude,
                latitude: body.latitude,
                startDate: body.startDate,
                endDate: body.endDate,
            },
        });
    }

    async delete(id: number, accountId: number): Promise<void> {
        const siteExist = await this.prismaService.site.count({
            where: {
                isActive: true,
                id,
                company: {
                    accountId,
                },
            },
        });
        if (!siteExist) throw new NotFoundException(Error.SITE_NOT_FOUND);

        await this.prismaService.site.update({
            where: {
                isActive: true,
                id,
                company: {
                    accountId,
                },
            },
            data: {
                isActive: false,
            },
        });
    }

    async getListContract(
        accountId: number,
        request: SiteCompanyGetListContractRequest,
    ): Promise<SiteCompanyGetListContractResponse> {
        const queryFilter: Prisma.SiteWhereInput = {
            company: {
                accountId,
            },
            ...(request.keyword && {
                name: {
                    contains: request.keyword,
                    mode: 'insensitive',
                },
            }),
            ...(request.startDate && { startDate: { gte: new Date(request.startDate) } }),
            ...(request.endDate && { endDate: { lte: new Date(request.endDate) } }),
        };
        const sites = (
            await this.prismaService.site.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                    numberOfContract: true,
                },
                ...QueryPagingHelper.queryPaging(request),
            })
        ).map((item) => {
            return {
                siteId: item.id,
                siteName: item.name,
                startDate: item.startDate,
                endDate: item.endDate,
                numberOfContract: item.numberOfContract,
            };
        });
        const total = await this.prismaService.site.count({ where: queryFilter });
        return new PaginationResponse(sites, new PageInfo(total));
    }
}
