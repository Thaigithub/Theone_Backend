import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';
import { SiteCompanyUpdateRequest } from './request/site-company-update.request';
import { SiteCompanyGetDetailResponse } from './response/site-company-get-detail.response';
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

        return await this.prismaService.site.findUnique({
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
            },
            where: {
                isActive: true,
                id,
                companyId,
            },
        });
    }

    async createSite(body: SiteCompanyCreateRequest, accountId: number): Promise<void> {
        const companyId = await this.getCompanyId(accountId);
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
        const companyId = await this.getCompanyId(accountId);

        const siteExist = await this.prismaService.site.count({
            where: {
                isActive: true,
                id,
                companyId,
            },
        });
        if (!siteExist) throw new NotFoundException('Site does not exist');

        if (body.startDate) body.startDate = new Date(body.startDate).toISOString();
        if (body.endDate) body.endDate = new Date(body.endDate).toISOString();
        await this.prismaService.site.update({
            where: {
                isActive: true,
                id,
                companyId,
            },
            data: {
                ...body,
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
}
