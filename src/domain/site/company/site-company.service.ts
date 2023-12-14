import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';

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

    async createSite(body: SiteCompanyCreateRequest, accountId: number) {
        const companyId = await this.getCompanyId(accountId);
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
