import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MemberEvaluationByCompany, Prisma, TeamEvaluationByCompany } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { EvaluationStatus, MemberSearchCategory, TeamSearchCategory } from './dto/evaluation-company-get-list-request.enum';
import { EvaluationType } from './dto/evaluation-company-type.enum';
import { EvaluationCompanyCreateEvaluationRequest } from './request/evaluation-company-create-evaluation.request';
import { EvaluationCompanyGetListMembersRequest } from './request/evaluation-company-get-list-members.request';
import { EvaluationCompanyGetListTeamsRequest } from './request/evaluation-company-get-list-teams.request';
import { MemberEvaluationByCompanyResponse } from './response/evaluation-company-get-list-members.response';
import { TeamEvaluationByCompanyResponse } from './response/evaluation-company-get-list-teams.response';

@Injectable()
export class EvaluationCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private async checkEvaluationByCompanyExist(
        accountId: number,
        evaluationType: EvaluationType,
        id: number,
    ): Promise<MemberEvaluationByCompany | TeamEvaluationByCompany> {
        let evaluationByCompany: MemberEvaluationByCompany | TeamEvaluationByCompany;
        switch (evaluationType) {
            case EvaluationType.MEMBER:
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
            case EvaluationType.TEAM:
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
        if (!evaluationByCompany) throw new NotFoundException('Evaluation ticket not found');
        if (evaluationByCompany.score) throw new BadRequestException('This member/team is already evaluated');
        return evaluationByCompany;
    }

    private parseConditionFromQuery(
        evaluationType: EvaluationType,
        accountId: number,
        query: EvaluationCompanyGetListMembersRequest | EvaluationCompanyGetListTeamsRequest,
    ): Prisma.MemberEvaluationByCompanyWhereInput | Prisma.TeamEvaluationByCompanyWhereInput {
        switch (evaluationType) {
            case EvaluationType.MEMBER:
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
                        },
                        {
                            OR:
                                query.searchCategory && query.keyword
                                    ? [
                                          query.searchCategory === MemberSearchCategory.NAME
                                              ? {
                                                    memberEvaluation: {
                                                        member: { name: { contains: query.keyword, mode: 'insensitive' } },
                                                    },
                                                }
                                              : {},
                                          query.searchCategory === MemberSearchCategory.CONTACT
                                              ? {
                                                    memberEvaluation: {
                                                        member: { contact: { contains: query.keyword, mode: 'insensitive' } },
                                                    },
                                                }
                                              : {},
                                      ]
                                    : undefined,
                        },
                    ],
                } as Prisma.MemberEvaluationByCompanyWhereInput;
            case EvaluationType.TEAM:
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
                        },
                        {
                            OR:
                                query.searchCategory && query.keyword
                                    ? [
                                          query.searchCategory === TeamSearchCategory.TEAM_NAME
                                              ? {
                                                    teamEvaluation: {
                                                        team: { name: { contains: query.keyword, mode: 'insensitive' } },
                                                    },
                                                }
                                              : {},
                                          query.searchCategory === TeamSearchCategory.LEADER_NAME
                                              ? {
                                                    teamEvaluation: {
                                                        team: {
                                                            leader: { name: { contains: query.keyword, mode: 'insensitive' } },
                                                        },
                                                    },
                                                }
                                              : {},
                                          query.searchCategory === TeamSearchCategory.LEADER_NAME
                                              ? {
                                                    teamEvaluation: {
                                                        team: {
                                                            leader: { contact: { contains: query.keyword, mode: 'insensitive' } },
                                                        },
                                                    },
                                                }
                                              : {},
                                      ]
                                    : undefined,
                        },
                    ],
                } as Prisma.TeamEvaluationByCompanyWhereInput;
        }
    }

    async evaluateMember(accountId: number, id: number, body: EvaluationCompanyCreateEvaluationRequest): Promise<void> {
        // Check whether evaluation ticket existed or evaluated
        const memberEvaluationByCompany = (await this.checkEvaluationByCompanyExist(
            accountId,
            EvaluationType.MEMBER,
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
        const totalScore = memberEvaluation.totalScore + body.score;

        // Update member evaluation table
        await this.prismaService.memberEvaluation.update({
            data: {
                totalEvaluators,
                totalScore,
                averageScore: totalScore / totalEvaluators,
            },
            where: {
                isActive: true,
                id: memberEvaluation.id,
            },
        });
    }

    async evaluateTeam(accountId: number, id: number, body: EvaluationCompanyCreateEvaluationRequest): Promise<void> {
        // Check whether evaluation ticket existed or evaluated
        const teamEvaluationByCompany = (await this.checkEvaluationByCompanyExist(
            accountId,
            EvaluationType.TEAM,
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
        const totalScore = teamEvaluation.totalScore + body.score;

        // Update team evaluation table
        await this.prismaService.teamEvaluation.update({
            data: {
                totalEvaluators,
                totalScore,
                averageScore: totalScore / totalEvaluators,
            },
            where: {
                isActive: true,
                id: teamEvaluation.id,
            },
        });
    }

    async getListMembers(
        accountId: number,
        query: EvaluationCompanyGetListMembersRequest,
    ): Promise<MemberEvaluationByCompanyResponse[]> {
        const listMemberEvaluationByCompany = await this.prismaService.memberEvaluationByCompany.findMany({
            include: {
                memberEvaluation: {
                    include: {
                        member: true,
                    },
                },
                site: true,
            },
            where: this.parseConditionFromQuery(
                EvaluationType.MEMBER,
                accountId,
                query,
            ) as Prisma.MemberEvaluationByCompanyWhereInput,
            ...QueryPagingHelper.queryPaging(query),
        });

        return listMemberEvaluationByCompany.map((item) => {
            return {
                id: item.id,
                memberName: item.memberEvaluation.member.name,
                contact: item.memberEvaluation.member.contact,
                siteName: item.site.name,
                score: item.score,
            };
        });
    }

    async getTotalMembers(accountId: number, query: EvaluationCompanyGetListMembersRequest): Promise<number> {
        return await this.prismaService.memberEvaluationByCompany.count({
            where: this.parseConditionFromQuery(
                EvaluationType.MEMBER,
                accountId,
                query,
            ) as Prisma.MemberEvaluationByCompanyWhereInput,
        });
    }

    async getListTeams(
        accountId: number,
        query: EvaluationCompanyGetListTeamsRequest,
    ): Promise<TeamEvaluationByCompanyResponse[]> {
        const listTeamEvaluationByCompany = await this.prismaService.teamEvaluationByCompany.findMany({
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
                EvaluationType.TEAM,
                accountId,
                query,
            ) as Prisma.TeamEvaluationByCompanyWhereInput,
            ...QueryPagingHelper.queryPaging(query),
        });

        return listTeamEvaluationByCompany.map((item) => {
            return {
                id: item.id,
                teamName: item.teamEvaluation.team.name,
                leaderName: item.teamEvaluation.team.leader.name,
                leaderContact: item.teamEvaluation.team.leader.contact,
                siteName: item.site.name,
                score: item.score,
            };
        });
    }

    async getTotalTeams(accountId: number, query: EvaluationCompanyGetListTeamsRequest): Promise<number> {
        return await this.prismaService.teamEvaluationByCompany.count({
            where: this.parseConditionFromQuery(
                EvaluationType.TEAM,
                accountId,
                query,
            ) as Prisma.TeamEvaluationByCompanyWhereInput,
        });
    }
}
