import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CompanyCompanyGetDetail } from './response/company-company-get-detail.response';

@Injectable()
export class CompanyCompanyService {
    constructor(private prismaService: PrismaService) {}
    async getDetail(accountId: number): Promise<CompanyCompanyGetDetail> {
        const company = await this.prismaService.company.findUnique({
            where: {
                accountId,
            },
            select: {
                name: true,
            },
        });
        return {
            name: company.name,
        };
    }
}
