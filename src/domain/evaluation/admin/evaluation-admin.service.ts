import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { GetListSiteEvaluationRequest } from './request/evaluation-admin.request';
import { SiteEvaluationResponse } from './response/evaluation-admin.response';
import { Prisma } from '@prisma/client';

@Injectable()
export class EvaluationAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getListSiteEvaluation(@Query() query: GetListSiteEvaluationRequest): Promise<SiteEvaluationResponse[]> {
        let orderBy: Prisma.SiteEvaluationOrderByWithRelationInput;
        switch (query.isHighestRating) {
            case 'true':
                orderBy = { averageScore: 'desc' };
                break;
            case 'false':
                orderBy = { averageScore: 'asc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }
        const siteEvaluations = await this.prismaService.siteEvaluation.findMany({
            select: {
                id: true,
                totalEvaluator: true,
                averageScore: true,
                Site: {
                    select: {
                        name: true,
                        Company: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy,
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
        return siteEvaluations.map((item) => {
            const newItem = {
                id: item.id,
                companyName: item.Site.Company.name,
                siteName: item.Site.name,
                totalEvaluator: item.totalEvaluator,
                averageScore: item.averageScore,
            };
            return newItem;
        });
    }

    async getTotalSiteEvaluation(): Promise<number> {
        return await this.prismaService.siteEvaluation.count({});
    }
}
