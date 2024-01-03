import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { EvaluationMemberCreateEvaluationRequest } from './request/evaluation-member-create-evaluation.request';
import { EvaluationMemberGetListRequest } from './request/evaluation-member-get-list.request';
import { Prisma } from '@prisma/client';
import { EvaluationStatus } from './dto/evaluation-member-get-list.enum';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteEvaluationByContractResponse } from './response/evaluation-member-get-list.response';

@Injectable()
export class EvaluationMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionFromQuery(
        accountId: number,
        query: EvaluationMemberGetListRequest,
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
                          query.status === EvaluationStatus.INCOMPLETE
                              ? {
                                    score: null,
                                }
                              : {},
                          query.status === EvaluationStatus.COMPLETE
                              ? {
                                    score: query.score ? query.score : { not: null },
                                }
                              : {},
                      ]
                    : undefined,
        };
    }

    async evaluateSite(accountId: number, id: number, body: EvaluationMemberCreateEvaluationRequest): Promise<void> {
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
        const totalScore = siteEvaluation.totalScore + body.score;

        // Update site evaluation table
        await this.prismaService.siteEvaluation.update({
            data: {
                totalEvaluators,
                totalScore,
                averageScore: totalScore / totalEvaluators,
            },
            where: {
                isActive: true,
                id: siteEvaluation.id,
            },
        });
    }

    async getListSites(accountId: number, query: EvaluationMemberGetListRequest): Promise<SiteEvaluationByContractResponse[]> {
        const listSiteEvaluationByContract = await this.prismaService.siteEvaluationByContract.findMany({
            include: {
                contract: true,
                siteEvaluation: {
                    include: {
                        site: {
                            include: {
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
                        },
                    },
                },
            },
            where: this.parseConditionFromQuery(accountId, query),
            ...QueryPagingHelper.queryPaging(query),
        });

        return listSiteEvaluationByContract.map((item) => {
            return {
                id: item.id,
                siteName: item.siteEvaluation.site.name,
                startWorkDate: item.contract.startDate,
                endWorkDate: item.contract.endDate,
                score: item.score,
                logo: {
                    fileName: item.siteEvaluation.site.company.logo ? item.siteEvaluation.site.company.logo.file.fileName : null,
                    type: item.siteEvaluation.site.company.logo ? item.siteEvaluation.site.company.logo.file.type : null,
                    key: item.siteEvaluation.site.company.logo ? item.siteEvaluation.site.company.logo.file.key : null,
                },
            };
        });
    }

    async getTotalSites(accountId: number, query: EvaluationMemberGetListRequest): Promise<number> {
        return await this.prismaService.siteEvaluationByContract.count({
            where: this.parseConditionFromQuery(accountId, query),
        });
    }
}
