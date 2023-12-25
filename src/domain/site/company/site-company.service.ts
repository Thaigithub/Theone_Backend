import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';
import { SiteCompanyGetListForContractRequest } from './request/site-company-get-list-contract-site.request';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';
import { SiteCompanyUpdateRequest } from './request/site-company-update.request';
import { SiteCompanyGetDetailResponse } from './response/site-company-get-detail.response';
import { SiteCompanyGetListForContractResponse } from './response/site-company-get-list-contract-site.response';
import { SiteResponse } from './response/site-company-get-list.response';

@Injectable()
export class SiteCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private async getCompanyId(accountId: number): Promise<number> {
        const company = await this.prismaService.company.findUnique({
            select: {
                id: true,
            },
            where: {
                isActive: true,
                accountId,
            },
        });
        return company.id;
    }

    async getTotal(): Promise<number> {
        return await this.prismaService.site.count({
            where: {
                isActive: true,
            },
        });
    }

    async getList(query: SiteCompanyGetListRequest, accountId: number): Promise<SiteResponse[]> {
        const companyId = await this.getCompanyId(accountId);

        return await this.prismaService.site.findMany({
            select: {
                id: true,
                name: true,
                personInCharge: true,
                startDate: true,
                endDate: true,
            },
            where: {
                isActive: true,
                status: query.status,
                companyId,
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
    }

    async getDetail(id: number, accountId: number): Promise<SiteCompanyGetDetailResponse> {
        const companyId = await this.getCompanyId(accountId);

        const siteExist = await this.prismaService.site.count({
            where: {
                isActive: true,
                id,
                companyId,
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
                companyId,
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
        const companyId = await this.getCompanyId(accountId);
        body.startDate = new Date(body.startDate).toISOString();
        body.endDate = new Date(body.endDate).toISOString();
        const { regionId, ...rest } = body;
        const [cityId, districtId] = regionId.split('-').map(Number);
        const idNationWide = (
            await this.prismaService.city.findMany({
                where: {
                    englishName: 'Nationwide',
                },
                select: {
                    id: true,
                },
            })
        ).map((item) => item.id);
        if (idNationWide.includes(cityId)) throw new BadRequestException('City Id must not be nationwide');
        await this.prismaService.site.create({
            data: {
                ...rest,
                companyId,
                districtId,
            },
        });
    }

    async updateSite(id: number, body: SiteCompanyUpdateRequest, accountId: number): Promise<void> {
        const companyId = await this.getCompanyId(accountId);

        const siteExist = await this.prismaService.site.count({
            where: {
                isActive: true,
                id,
                companyId,
            },
        });
        if (!siteExist) throw new NotFoundException('Site does not exist');

        const { regionId, ...rest } = body;
        const [cityId, districtId] = regionId.split('-').map(Number);
        const idNationWide = (
            await this.prismaService.city.findMany({
                where: {
                    englishName: 'Nationwide',
                },
                select: {
                    id: true,
                },
            })
        ).map((item) => item.id);
        if (idNationWide.includes(cityId)) throw new BadRequestException('City Id must not be nationwide');
        if (body.startDate) body.startDate = new Date(body.startDate).toISOString();
        if (body.endDate) body.endDate = new Date(body.endDate).toISOString();
        await this.prismaService.site.update({
            where: {
                isActive: true,
                id,
                companyId,
            },
            data: {
                ...rest,
                districtId,
            },
        });
    }

    async deleteSite(id: number, accountId: number): Promise<void> {
        const companyId = await this.getCompanyId(accountId);

        const siteExist = await this.prismaService.site.count({
            where: {
                isActive: true,
                id,
                companyId,
            },
        });
        if (!siteExist) throw new NotFoundException('Site does not exist');

        await this.prismaService.site.update({
            where: {
                isActive: true,
                id,
                companyId,
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
            skip: request.pageNumber && (parseInt(request.pageNumber) - 1) * parseInt(request.pageSize),
            take: request.pageSize && parseInt(request.pageSize),
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
