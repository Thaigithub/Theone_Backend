import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';
import { SiteCompanyGetListForContractRequest } from './request/site-company-get-list-contract.request';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';
import { SiteCompanyUpdateRequest } from './request/site-company-update.request';
import { SiteCompanyGetDetailResponse } from './response/site-company-get-detail.response';
import { SiteCompanyGetListForContractResponse } from './response/site-company-get-list-contract.response';
import { SiteResponse } from './response/site-company-get-list.response';
import { Prisma } from '@prisma/client';
import { ProgressStatus } from './dto/site-company-progress-status.enum';

@Injectable()
export class SiteCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionFromQuery(accountId: number, query: SiteCompanyGetListRequest): Prisma.SiteWhereInput {
        const siteWhereInput: Prisma.SiteWhereInput = {
            isActive: true,
            company: {
                accountId,
            },
        };
        switch (query.progressStatus) {
            case ProgressStatus.WAITING:
                siteWhereInput.startDate = { gt: new Date() };
                break;
            case ProgressStatus.IN_PROGRESS:
                siteWhereInput.startDate = { lte: new Date() };
                siteWhereInput.endDate = { gte: new Date() };
                break;
            case ProgressStatus.END:
                siteWhereInput.endDate = { lt: new Date() };
                break;
        }
        return siteWhereInput;
    }

    async getTotal(query: SiteCompanyGetListRequest, accountId: number): Promise<number> {
        return await this.prismaService.site.count({
            where: this.parseConditionFromQuery(accountId, query),
        });
    }

    async getList(query: SiteCompanyGetListRequest, accountId: number): Promise<SiteResponse[]> {
        const companies = await this.prismaService.site.findMany({
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
            where: this.parseConditionFromQuery(accountId, query),
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });

        return companies.map((item) => {
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
            select: {
                id: true,
                name: true,
                address: true,
                contact: true,
                personInCharge: true,
                personInChargeContact: true,
                email: true,
                taxInvoiceEmail: true,
                siteManagementNumber: true,
                contractStatus: true,
                startDate: true,
                endDate: true,
                district: {
                    select: {
                        englishName: true,
                        koreanName: true,
                        city: {
                            select: {
                                englishName: true,
                                koreanName: true,
                            },
                        },
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

    async createSite(body: SiteCompanyCreateRequest, accountId: number): Promise<void> {
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

    async updateSite(id: number, body: SiteCompanyUpdateRequest, accountId: number): Promise<void> {
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

    async deleteSite(id: number, accountId: number): Promise<void> {
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

    async getListForContractSite(
        accountId: number,
        request: SiteCompanyGetListForContractRequest,
    ): Promise<SiteCompanyGetListForContractResponse> {
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
