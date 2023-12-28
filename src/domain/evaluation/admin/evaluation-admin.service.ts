import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { EvaluationType } from './dto/evaluation-admin.dto';
import { MemberEvaluationAdminGetListRequest } from './request/member-evaluation-admin-get-list.request';
import {
    SiteEvaluationAdminGetListRequest,
    SiteEvaluationSearchCategory,
} from './request/site-evaluation-admin-get-list.request';
import {
    TeamEvaluationAdminGetListRequest,
    TeamEvaluationSearchCategory,
} from './request/team-evaluation-admin-get-list.request';
import { MemberEvaluationAdminGetDetailResponse } from './response/member-evaluation-admin-get-detail.response';
import { MemberEvaluationResponse } from './response/member-evaluation-admin-get-list.response';
import { SiteEvaluationAdminGetDetailResponse } from './response/site-evaluation-admin-get-detail.response';
import { SiteEvaluationResponse } from './response/site-evaluation-admin-get-list.response';
import { TeamEvaluationAdminGetDetailResponse } from './response/team-evaluation-admin-get-detail.response';
import { TeamEvaluationResponse } from './response/team-evaluation-admin-get-list.response';
import { QueryPagingHelper } from 'utils/pagination-query';

@Injectable()
export class EvaluationAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionsFromQuery(
        evaluationType: EvaluationType,
        query: SiteEvaluationAdminGetListRequest | TeamEvaluationAdminGetListRequest | MemberEvaluationAdminGetListRequest,
    ) {
        let whereConditions = {};
        switch (evaluationType) {
            case EvaluationType.SITE:
                const siteQuery = query as SiteEvaluationAdminGetListRequest;
                whereConditions = {
                    isActive: true,
                    site: {
                        name:
                            siteQuery.searchCategory === SiteEvaluationSearchCategory.SITE_NAME
                                ? {
                                      contains: siteQuery.keyword,
                                  }
                                : undefined,
                        company: {
                            name:
                                siteQuery.searchCategory === SiteEvaluationSearchCategory.COMPANY_NAME
                                    ? {
                                          contains: siteQuery.keyword,
                                      }
                                    : undefined,
                        },
                    },
                };
                break;
            case EvaluationType.TEAM:
                const teamQuery = query as TeamEvaluationAdminGetListRequest;
                whereConditions = {
                    isActive: true,
                    team: {
                        name:
                            teamQuery.searchCategory === TeamEvaluationSearchCategory.TEAM_NAME
                                ? {
                                      contains: teamQuery.keyword,
                                  }
                                : undefined,
                        leader: {
                            name:
                                teamQuery.searchCategory === TeamEvaluationSearchCategory.LEADER_NAME
                                    ? {
                                          contains: teamQuery.keyword,
                                      }
                                    : undefined,
                        },
                    },
                };
                break;
            case EvaluationType.MEMBER:
                const memberQuery = query as MemberEvaluationAdminGetListRequest;
                whereConditions = {
                    isActive: true,
                    member: {
                        name: memberQuery.keyword && { contains: memberQuery.keyword },
                    },
                };
                break;
        }
        return whereConditions;
    }

    private handleOrderBy(isHighestRating: string) {
        let orderBy: Prisma.SiteEvaluationOrderByWithRelationInput;
        switch (isHighestRating) {
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
        return orderBy;
    }

    async getTotal(
        evaluationType: EvaluationType,
        query: SiteEvaluationAdminGetListRequest | TeamEvaluationAdminGetListRequest | MemberEvaluationAdminGetListRequest,
    ) {
        let count: number;
        switch (evaluationType) {
            case EvaluationType.SITE:
                count = await this.prismaService.siteEvaluation.count({
                    where: this.parseConditionsFromQuery(evaluationType, query),
                });
                break;
            case EvaluationType.TEAM:
                count = await this.prismaService.teamEvaluation.count({
                    where: this.parseConditionsFromQuery(evaluationType, query),
                });
                break;
            case EvaluationType.MEMBER:
                count = await this.prismaService.memberEvaluation.count({
                    where: this.parseConditionsFromQuery(evaluationType, query),
                });
                break;
        }
        return count;
    }

    async getListSiteEvaluation(@Query() query: SiteEvaluationAdminGetListRequest): Promise<SiteEvaluationResponse[]> {
        const orderBy = this.handleOrderBy(query.isHighestRating);
        const siteEvaluations = await this.prismaService.siteEvaluation.findMany({
            select: {
                id: true,
                totalEvaluators: true,
                averageScore: true,
                site: {
                    select: {
                        name: true,
                        company: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            where: this.parseConditionsFromQuery(EvaluationType.SITE, query),
            orderBy,
            ...QueryPagingHelper.queryPaging(query),
        });
        return siteEvaluations.map((item) => {
            return {
                id: item.id,
                companyName: item.site.company.name,
                siteName: item.site.name,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });
    }

    async getSiteEvaluationDetail(id: number): Promise<SiteEvaluationAdminGetDetailResponse> {
        const evaluationExist = await this.prismaService.siteEvaluation.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!evaluationExist) throw new NotFoundException('Evaluation does not exist');

        const siteEvaluation = await this.prismaService.siteEvaluation.findUnique({
            select: {
                totalEvaluators: true,
                averageScore: true,
                site: {
                    select: {
                        name: true,
                        personInCharge: true,
                        address: true,
                        contact: true,
                        company: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                siteEvaluationByMember: {
                    select: {
                        score: true,
                        member: {
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
        const listOfEvaluators = siteEvaluation.siteEvaluationByMember.map((item) => {
            return {
                name: item.member.name,
                username: item.member.account.username,
                contact: item.member.contact,
                score: item.score,
            };
        });
        return {
            companyName: siteEvaluation.site.company.name,
            siteName: siteEvaluation.site.name,
            address: siteEvaluation.site.address,
            contact: siteEvaluation.site.contact,
            personInCharge: siteEvaluation.site.personInCharge,
            totalEvaluators: siteEvaluation.totalEvaluators,
            averageScore: siteEvaluation.averageScore,
            listOfEvaluators,
        };
    }

    async getListTeamEvaluation(@Query() query: TeamEvaluationAdminGetListRequest): Promise<TeamEvaluationResponse[]> {
        const orderBy = this.handleOrderBy(query.isHighestRating);
        const teamEvaluations = await this.prismaService.teamEvaluation.findMany({
            select: {
                id: true,
                totalEvaluators: true,
                averageScore: true,
                team: {
                    select: {
                        name: true,
                        totalMembers: true,
                        leader: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            where: this.parseConditionsFromQuery(EvaluationType.TEAM, query),
            orderBy,
            ...QueryPagingHelper.queryPaging(query),
        });
        return teamEvaluations.map((item) => {
            return {
                id: item.id,
                teamName: item.team.name,
                leaderName: item.team.leader.name,
                totalMembers: item.team.totalMembers,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });
    }

    async getTeamEvaluationDetail(id: number): Promise<TeamEvaluationAdminGetDetailResponse> {
        const evaluationExist = await this.prismaService.teamEvaluation.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!evaluationExist) throw new NotFoundException('Evaluation does not exist');

        const teamEvaluation = await this.prismaService.teamEvaluation.findUnique({
            select: {
                totalEvaluators: true,
                averageScore: true,
                team: {
                    select: {
                        name: true,
                        totalMembers: true,
                        leader: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                teamEvaluationByCompany: {
                    select: {
                        score: true,
                        site: {
                            select: {
                                name: true,
                                contact: true,
                                personInCharge: true,
                                company: {
                                    select: {
                                        name: true,
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
        const listOfEvaluators = teamEvaluation.teamEvaluationByCompany.map((item) => {
            return {
                companyName: item.site.company.name,
                siteName: item.site.name,
                siteContact: item.site.contact,
                personInCharge: item.site.personInCharge,
                score: item.score,
            };
        });
        return {
            teamName: teamEvaluation.team.name,
            leaderName: teamEvaluation.team.leader.name,
            totalMembers: teamEvaluation.team.totalMembers,
            totalEvaluators: teamEvaluation.totalEvaluators,
            averageScore: teamEvaluation.averageScore,
            listOfEvaluators,
        };
    }

    async getListMemberEvaluation(@Query() query: MemberEvaluationAdminGetListRequest): Promise<MemberEvaluationResponse[]> {
        const orderBy = this.handleOrderBy(query.isHighestRating);
        const memberEvaluations = this.prismaService.memberEvaluation.findMany({
            select: {
                id: true,
                totalEvaluators: true,
                averageScore: true,
                member: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
            },
            where: this.parseConditionsFromQuery(EvaluationType.MEMBER, query),
            orderBy,
            ...QueryPagingHelper.queryPaging(query),
        });
        return (await memberEvaluations).map((item) => {
            return {
                id: item.id,
                name: item.member.name,
                contact: item.member.contact,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });
    }

    async getMemberEvaluationDetail(id: number): Promise<MemberEvaluationAdminGetDetailResponse> {
        const evaluationExist = await this.prismaService.memberEvaluation.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!evaluationExist) throw new NotFoundException('Evaluation does not exist');

        const memberEvaluation = await this.prismaService.memberEvaluation.findUnique({
            select: {
                totalEvaluators: true,
                averageScore: true,
                member: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
                memberEvaluationByCompany: {
                    select: {
                        score: true,
                        site: {
                            select: {
                                name: true,
                                contact: true,
                                personInCharge: true,
                                company: {
                                    select: {
                                        name: true,
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
        const listOfEvaluators = memberEvaluation.memberEvaluationByCompany.map((item) => {
            return {
                companyName: item.site.company.name,
                siteName: item.site.name,
                siteContact: item.site.contact,
                personInCharge: item.site.personInCharge,
                score: item.score,
            };
        });
        return {
            name: memberEvaluation.member.name,
            contact: memberEvaluation.member.contact,
            totalEvaluators: memberEvaluation.totalEvaluators,
            averageScore: memberEvaluation.averageScore,
            listOfEvaluators,
        };
    }
}
