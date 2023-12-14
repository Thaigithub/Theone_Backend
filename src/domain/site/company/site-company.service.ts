import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';
import { SiteResponse } from './response/site-company-get-list.response';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';

@Injectable()
export class SiteCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private async getCompanyId(accountId: number): Promise<number> {
        const company = await this.prismaService.company.findUnique({
            select: {
                id: true,
            },
            where: {
                accountId,
            },
        });
        return company.id;
    }

    async getTotal(): Promise<number> {
        return await this.prismaService.site.count({});
    }

    async getList(query: SiteCompanyGetListRequest): Promise<SiteResponse[]> {
        return await this.prismaService.site.findMany({
            select: {
                id: true,
                name: true,
                personInCharge: true,
                startDate: true,
                endDate: true,
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
    }

    async createSite(body: SiteCompanyCreateRequest, accountId: number) {
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

    async deleteSite(id: number) {
        const siteExist = await this.prismaService.site.count({
            where: {
                id,
            },
        });
        if (!siteExist) throw new NotFoundException('Site does not exist');
        await this.prismaService.site.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
