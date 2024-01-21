import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
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
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: SiteCompanyGetListRequest, accountId: number): Promise<SiteCompanyGetListResponse> {
        const search = {
            include: {
                district: {
                    include: {
                        city: true,
                    },
                },
                company: {
                    include: {
                        logo: {
                            include: {
                                file: true,
                            },
                        },
                    },
                },
            },
            where: {
                isActive: true,
                company: {
                    accountId,
                },
            },
            ...QueryPagingHelper.queryPaging(query),
        };
        switch (query.progressStatus) {
            case SiteCompanyGetListStatus.WAITING:
                search['startDate'] = { gt: new Date() };
                break;
            case SiteCompanyGetListStatus.IN_PROGRESS:
                search['startDate'] = { lte: new Date() };
                search['endDate'] = { gte: new Date() };
                break;
            case SiteCompanyGetListStatus.END:
                search['endDate'] = { lt: new Date() };
                break;
        }

        const sites = (await this.prismaService.site.findMany(search)).map((item) => {
            return {
                id: item.id,
                name: item.name,
                personInCharge: item.personInCharge,
                personInChargeContact: item.personInChargeContact,
                originalBuilding: item.originalBuilding,
                startDate: item.startDate,
                endDate: item.endDate,
                cityKoreanName: item.district?.city.koreanName ? item.district.city.koreanName : null,
                cityEnglishName: item.district?.city.englishName ? item.district.city.englishName : null,
                districtKoreanName: item.district?.koreanName ? item.district.koreanName : null,
                districtEnglishName: item.district?.englishName ? item.district.englishName : null,
                companyLogoKey: item.company.logo ? item.company.logo.file.key : null,
            };
        });
        const total = await this.prismaService.site.count({ where: search.where });
        return new PaginationResponse(sites, new PageInfo(total));
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
        if (!siteExist) throw new NotFoundException('Site does not exist');

        const site = await this.prismaService.site.findUnique({
            include: {
                district: {
                    include: {
                        city: true,
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
            city: site.district.city.englishName,
            district: site.district.englishName,
            cityKorean: site.district.city.koreanName,
            districtKorean: site.district.koreanName,
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
                ...body,
                companyId,
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
        if (!siteExist) throw new NotFoundException('Site does not exist');

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
                ...body,
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
        if (!siteExist) throw new NotFoundException('Site does not exist');

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
        const query = {
            where: {
                company: {
                    accountId,
                },
                name: {
                    contains: request.keyword,
                },
            },
            select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                numberOfContract: true,
            },
            ...QueryPagingHelper.queryPaging(request),
        };
        const sites = (await this.prismaService.site.findMany(query)).map((item) => {
            return {
                siteId: item.id,
                siteName: item.name,
                startDate: item.startDate,
                endDate: item.endDate,
                numberOfContract: item.numberOfContract,
            };
        });
        const total = await this.prismaService.site.count({ where: query.where });
        return new PaginationResponse(sites, new PageInfo(total));
    }
}
