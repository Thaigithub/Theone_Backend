import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { EvaluationMemberStatus } from './dto/evaluation-member-get-list.enum';
import { EvaluationMemberCreateSiteRequest } from './request/evaluation-member-create-site.request';
import { EvaluationMemberGetListSiteRequest } from './request/evaluation-member-get-list-site.request';
import { EvaluationMemberGetListSiteResponse } from './response/evaluation-member-get-list-site.response';

@Injectable()
export class EvaluationMemberService {
    constructor(private prismaService: PrismaService) {}

    private parseConditionFromQuery(
        accountId: number,
        query: EvaluationMemberGetListSiteRequest,
    ): Prisma.SiteEvaluationByContractWhereInput {
        query.startWorkDate = query.startWorkDate ? new Date(query.startWorkDate).toISOString() : undefined;
        query.endWorkDate = query.endWorkDate ? new Date(query.endWorkDate).toISOString() : undefined;
        return {
            isActive: true,
            contract: {
                application: {
                    member: {
                        accountId,
                    },
                },
                startDate: { gte: query.startWorkDate },
                endDate: { lte: query.endWorkDate },
            },
            siteEvaluation: {
                site: {
                    name: { contains: query.keyword, mode: 'insensitive' },
                },
            },
            OR:
                query.score || query.status
                    ? [
                          query.score
                              ? {
                                    score: query.score,
                                }
                              : {},
                          query.status === EvaluationMemberStatus.INCOMPLETE
                              ? {
                                    score: null,
                                }
                              : {},
                          query.status === EvaluationMemberStatus.COMPLETE
                              ? {
                                    score: query.score ? query.score : { not: null },
                                }
                              : {},
                      ]
                    : undefined,
        };
    }

    async updateSiteScore(accountId: number, id: number, body: EvaluationMemberCreateSiteRequest): Promise<void> {
        // Check whether evaluation ticket existed or evaluated
        const siteEvaluationByMember = await this.prismaService.siteEvaluationByContract.findUnique({
            where: {
                isActive: true,
                id,
                contract: {
                    application: {
                        member: {
                            accountId,
                        },
                    },
                },
            },
        });
        if (!siteEvaluationByMember) throw new NotFoundException('Evaluation ticket not found');
        if (siteEvaluationByMember.score) throw new BadRequestException('This site is already evaluated');

        // Update evaluation ticket
        await this.prismaService.siteEvaluationByContract.update({
            data: {
                score: body.score,
            },
            where: {
                isActive: true,
                id,
                contract: {
                    application: {
                        member: {
                            accountId,
                        },
                    },
                },
            },
        });

        // Calculate new value in site evaluation table
        const siteEvaluation = await this.prismaService.siteEvaluation.findUnique({
            where: {
                isActive: true,
                id: siteEvaluationByMember.siteEvaluationId,
            },
        });
        const totalEvaluators = siteEvaluation.totalEvaluators + 1;
        const totalScores = siteEvaluation.totalScores + body.score;

        // Update site evaluation table
        await this.prismaService.siteEvaluation.update({
            data: {
                totalEvaluators,
                totalScores,
                averageScore: totalScores / totalEvaluators,
            },
            where: {
                isActive: true,
                id: siteEvaluation.id,
            },
        });
    }

    async getListSite(
        accountId: number,
        query: EvaluationMemberGetListSiteRequest,
    ): Promise<EvaluationMemberGetListSiteResponse> {
        const listSiteEvaluationByContract = (
            await this.prismaService.siteEvaluationByContract.findMany({
                include: {
                    contract: true,
                    siteEvaluation: {
                        include: {
                            site: {
                                include: {
                                    company: {
                                        include: {
                                            logo: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                where: this.parseConditionFromQuery(accountId, query),
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                siteName: item.siteEvaluation.site.name,
                startWorkDate: item.contract.startDate,
                endWorkDate: item.contract.endDate,
                score: item.score,
                logo: {
                    fileName: item.siteEvaluation.site.company.logo.fileName,
                    type: item.siteEvaluation.site.company.logo.type,
                    key: item.siteEvaluation.site.company.logo.key,
                    size: Number(item.siteEvaluation.site.company.logo.size),
                },
            };
        });
        const total = await this.getTotalSites(accountId, query);
        return new PaginationResponse(listSiteEvaluationByContract, new PageInfo(total));
    }

    async getTotalSites(accountId: number, query: EvaluationMemberGetListSiteRequest): Promise<number> {
        return await this.prismaService.siteEvaluationByContract.count({
            where: this.parseConditionFromQuery(accountId, query),
        });
    }

    async getTotalCompleted(accountId: number): Promise<number> {
        return await this.prismaService.siteEvaluationByContract.count({
            where: {
                isActive: true,
                contract: {
                    application: {
                        member: {
                            accountId,
                        },
                    },
                },
                score: { not: null },
            },
        });
    }
}
