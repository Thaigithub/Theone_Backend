import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MemberEvaluationByCompany, Prisma, TeamEvaluationByCompany } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { EvaluationCompanyGetListStatus } from './enum/evaluation-company-get-list-request.enum';
import { EvaluationCompanyType } from './enum/evaluation-company-type.enum';
import { EvaluationCompanyCreateEvaluationRequest } from './request/evaluation-company-create-evaluation.request';
import { EvaluationCompanyGetListRequest } from './request/evaluation-company-get-list.request';
import { EvaluationCompanyGetListMemberResponse } from './response/evaluation-company-get-list-members.response';
import { EvaluationCompanyGetListTeamResponse } from './response/evaluation-company-get-list-teams.response';
import { Error } from 'utils/error.enum';

@Injectable()
export class EvaluationCompanyService {
    constructor(private prismaService: PrismaService) {}

    private async checkEvaluationByCompanyExist(
        accountId: number,
        evaluationType: EvaluationCompanyType,
        id: number,
    ): Promise<MemberEvaluationByCompany | TeamEvaluationByCompany> {
        let evaluationByCompany: MemberEvaluationByCompany | TeamEvaluationByCompany;
        switch (evaluationType) {
            case EvaluationCompanyType.MEMBER:
                evaluationByCompany = await this.prismaService.memberEvaluationByCompany.findUnique({
                    where: {
                        isActive: true,
                        id,
                        site: {
                            company: {
                                accountId,
                            },
                        },
                    },
                });
                break;
            case EvaluationCompanyType.TEAM:
                evaluationByCompany = await this.prismaService.teamEvaluationByCompany.findUnique({
                    where: {
                        isActive: true,
                        id,
                        site: {
                            company: {
                                accountId,
                            },
                        },
                    },
                });
                break;
        }
        if (!evaluationByCompany) throw new NotFoundException(Error.EVALUATION_NOT_FOUND);
        if (evaluationByCompany.score) throw new BadRequestException(Error.EVALUATION_HAS_BEEN_MADE);
        return evaluationByCompany;
    }

    private parseConditionFromQuery(
        evaluationType: EvaluationCompanyType,
        accountId: number,
        query: EvaluationCompanyGetListRequest,
    ): Prisma.MemberEvaluationByCompanyWhereInput | Prisma.TeamEvaluationByCompanyWhereInput {
        switch (evaluationType) {
            case EvaluationCompanyType.MEMBER:
                return {
                    isActive: true,
                    site: {
                        company: {
                            accountId,
                        },
                    },
                    AND: [
                        {
                            OR:
                                query.score || query.status
                                    ? [
                                          query.score
                                              ? {
                                                    score: query.score,
                                                }
                                              : {},
                                          query.status === EvaluationCompanyGetListStatus.INCOMPLETE
                                              ? {
                                                    score: null,
                                                }
                                              : {},
                                          query.status === EvaluationCompanyGetListStatus.COMPLETE
                                              ? {
                                                    score: query.score ? query.score : { not: null },
                                                }
                                              : {},
                                      ]
                                    : undefined,
                        },
                        {
                            OR: query.keyword
                                ? [
                                      {
                                          memberEvaluation: {
                                              member: {
                                                  name: { contains: query.keyword, mode: 'insensitive' },
                                              },
                                          },
                                      },
                                      {
                                          memberEvaluation: {
                                              member: {
                                                  contact: { contains: query.keyword, mode: 'insensitive' },
                                              },
                                          },
                                      },
                                      {
                                          site: {
                                              name: { contains: query.keyword, mode: 'insensitive' },
                                          },
                                      },
                                  ]
                                : undefined,
                        },
                    ],
                } as Prisma.MemberEvaluationByCompanyWhereInput;
            case EvaluationCompanyType.TEAM:
                return {
                    isActive: true,
                    site: {
                        company: {
                            accountId,
                        },
                    },
                    AND: [
                        {
                            OR:
                                query.score || query.status
                                    ? [
                                          query.score
                                              ? {
                                                    score: query.score,
                                                }
                                              : {},
                                          query.status === EvaluationCompanyGetListStatus.INCOMPLETE
                                              ? {
                                                    score: null,
                                                }
                                              : {},

                                          query.status === EvaluationCompanyGetListStatus.COMPLETE
                                              ? {
                                                    score: query.score ? query.score : { not: null },
                                                }
                                              : {},
                                      ]
                                    : undefined,
                        },
                        {
                            OR: query.keyword
                                ? [
                                      {
                                          teamEvaluation: {
                                              team: {
                                                  name: { contains: query.keyword, mode: 'insensitive' },
                                              },
                                          },
                                      },
                                      {
                                          teamEvaluation: {
                                              team: {
                                                  leader: {
                                                      contact: { contains: query.keyword, mode: 'insensitive' },
                                                  },
                                              },
                                          },
                                      },
                                      {
                                          site: {
                                              name: { contains: query.keyword, mode: 'insensitive' },
                                          },
                                      },
                                  ]
                                : undefined,
                        },
                    ],
                } as Prisma.TeamEvaluationByCompanyWhereInput;
        }
    }

    async updateMemberScore(accountId: number, id: number, body: EvaluationCompanyCreateEvaluationRequest): Promise<void> {
        // Check whether evaluation ticket existed or evaluated
        const memberEvaluationByCompany = (await this.checkEvaluationByCompanyExist(
            accountId,
            EvaluationCompanyType.MEMBER,
            id,
        )) as MemberEvaluationByCompany;

        // Update evaluation ticket
        await this.prismaService.memberEvaluationByCompany.update({
            data: {
                score: body.score,
            },
            where: {
                isActive: true,
                id,
                site: {
                    company: {
                        accountId,
                    },
                },
            },
        });

        // Calculate new value for member evaluation table
        const memberEvaluation = await this.prismaService.memberEvaluation.findUnique({
            where: {
                isActive: true,
                id: memberEvaluationByCompany.memberEvaluationId,
            },
        });
        const totalEvaluators = memberEvaluation.totalEvaluators + 1;
        const totalScores = memberEvaluation.totalScores + body.score;

        // Update member evaluation table
        await this.prismaService.memberEvaluation.update({
            data: {
                totalEvaluators,
                totalScores,
                averageScore: totalScores / totalEvaluators,
            },
            where: {
                isActive: true,
                id: memberEvaluation.id,
            },
        });
    }

    async updateTeamScore(accountId: number, id: number, body: EvaluationCompanyCreateEvaluationRequest): Promise<void> {
        // Check whether evaluation ticket existed or evaluated
        const teamEvaluationByCompany = (await this.checkEvaluationByCompanyExist(
            accountId,
            EvaluationCompanyType.TEAM,
            id,
        )) as TeamEvaluationByCompany;

        // Update evaluation ticket
        await this.prismaService.teamEvaluationByCompany.update({
            data: {
                score: body.score,
            },
            where: {
                isActive: true,
                id,
                site: {
                    company: {
                        accountId,
                    },
                },
            },
        });

        // Calculate new value for team evaluation table
        const teamEvaluation = await this.prismaService.teamEvaluation.findUnique({
            where: {
                isActive: true,
                id: teamEvaluationByCompany.teamEvaluationId,
            },
        });
        const totalEvaluators = teamEvaluation.totalEvaluators + 1;
        const totalScores = teamEvaluation.totalScores + body.score;

        // Update team evaluation table
        await this.prismaService.teamEvaluation.update({
            data: {
                totalEvaluators,
                totalScores,
                averageScore: totalScores / totalEvaluators,
            },
            where: {
                isActive: true,
                id: teamEvaluation.id,
            },
        });
    }

    async getListMember(
        accountId: number,
        query: EvaluationCompanyGetListRequest,
    ): Promise<EvaluationCompanyGetListMemberResponse> {
        const listMemberEvaluationByCompany = (
            await this.prismaService.memberEvaluationByCompany.findMany({
                include: {
                    memberEvaluation: {
                        include: {
                            member: true,
                        },
                    },
                    site: true,
                },
                where: this.parseConditionFromQuery(
                    EvaluationCompanyType.MEMBER,
                    accountId,
                    query,
                ) as Prisma.MemberEvaluationByCompanyWhereInput,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                memberName: item.memberEvaluation.member.name,
                contact: item.memberEvaluation.member.contact,
                siteName: item.site.name,
                score: item.score,
            };
        });

        const total = await this.getTotalMembers(accountId, query);
        return new PaginationResponse(listMemberEvaluationByCompany, new PageInfo(total));
    }

    async getTotalMembers(accountId: number, query: EvaluationCompanyGetListRequest): Promise<number> {
        return await this.prismaService.memberEvaluationByCompany.count({
            where: this.parseConditionFromQuery(
                EvaluationCompanyType.MEMBER,
                accountId,
                query,
            ) as Prisma.MemberEvaluationByCompanyWhereInput,
        });
    }

    async getListTeam(accountId: number, query: EvaluationCompanyGetListRequest): Promise<EvaluationCompanyGetListTeamResponse> {
        const listTeamEvaluationByCompany = (
            await this.prismaService.teamEvaluationByCompany.findMany({
                include: {
                    teamEvaluation: {
                        include: {
                            team: {
                                include: {
                                    leader: true,
                                },
                            },
                        },
                    },
                    site: true,
                },
                where: this.parseConditionFromQuery(
                    EvaluationCompanyType.TEAM,
                    accountId,
                    query,
                ) as Prisma.TeamEvaluationByCompanyWhereInput,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                teamName: item.teamEvaluation.team.name,
                leaderName: item.teamEvaluation.team.leader.name,
                leaderContact: item.teamEvaluation.team.leader.contact,
                siteName: item.site.name,
                score: item.score,
            };
        });

        const total = await this.getTotalTeams(accountId, query);
        return new PaginationResponse(listTeamEvaluationByCompany, new PageInfo(total));
    }

    async getTotalTeams(accountId: number, query: EvaluationCompanyGetListRequest): Promise<number> {
        return await this.prismaService.teamEvaluationByCompany.count({
            where: this.parseConditionFromQuery(
                EvaluationCompanyType.TEAM,
                accountId,
                query,
            ) as Prisma.TeamEvaluationByCompanyWhereInput,
        });
    }
}
