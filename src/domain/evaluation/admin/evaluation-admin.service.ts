import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { GetListSiteEvaluationRequest } from './request/evaluation-admin.request';
import { GetSiteEvaluationDetailResponse, SiteEvaluationResponse } from './response/evaluation-admin.response';
import { Prisma } from '@prisma/client';

@Injectable()
export class EvaluationAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionsFromQuery(query: GetListSiteEvaluationRequest) {
        return {
            isActive: true,
            Site: {
                name: query.keywordBySiteName && { contains: query.keywordBySiteName },
                Company: {
                    name: query.keywordByCompanyName && { contains: query.keywordByCompanyName },
                },
            },
        };
    }

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
            where: this.parseConditionsFromQuery(query),
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

    async getTotalSiteEvaluation(@Query() query: GetListSiteEvaluationRequest): Promise<number> {
        return await this.prismaService.siteEvaluation.count({
            where: this.parseConditionsFromQuery(query),
        });
    }

    async getSiteEvaluationDetail(id: number): Promise<GetSiteEvaluationDetailResponse> {
        const siteEvaluation = await this.prismaService.siteEvaluation.findUnique({
            select: {
                totalEvaluator: true,
                averageScore: true,
                Site: {
                    select: {
                        name: true,
                        personInCharge: true,
                        address: true,
                        contact: true,
                        Company: {
                            select: {
                                name: true,
                            }
                        }
                    },
                },
                SiteEvaluationByMember: {
                    select: {
                        score: true,
                        Member: {
                            select: {
                                name: true,
                                contact: true,
                                account: {
                                    select: {
                                        username: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                isActive: true,
                id,
            },
        });
        const listOfEvaluators = siteEvaluation.SiteEvaluationByMember.map((item) => {
            const evaluator = {
                name: item.Member.name,
                username: item.Member.account.username,
                contact: item.Member.contact,
                score: item.score,
            };
            return evaluator;
        });
        return {
            companyName: siteEvaluation.Site.Company.name,
            siteName: siteEvaluation.Site.name,
            address: siteEvaluation.Site.address,
            contact: siteEvaluation.Site.contact,
            personInCharge: siteEvaluation.Site.personInCharge,
            totalEvaluators: siteEvaluation.totalEvaluator,
            averageScore: siteEvaluation.averageScore,
            listOfEvaluators,
        }
    }
}
