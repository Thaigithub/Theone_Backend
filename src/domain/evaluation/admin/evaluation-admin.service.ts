import { Injectable, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { EvaluationType } from './dto/evaluation-admin.dto';
import { SiteEvaluationAdminGetListRequest } from './request/site-evaluation-admin-get-list.request';
import { SiteEvaluationResponse } from './response/site-evaluation-admin-get-list.response';
import { TeamEvaluationAdminGetListRequest } from './request/team-evaluation-admin-get-list.request';
import { SiteEvaluationAdminGetDetailResponse } from './response/site-evaluation-admin-get-detail.response';
import { TeamEvaluationResponse } from './response/team-evaluation-admin-get-list.response';
import { TeamEvaluationAdminGetDetailResponse } from './response/team-evaluation-admin-get-detail.response';
import { MemberEvaluationAdminGetListRequest } from './request/member-evaluation-admin-get-list.request';
import { MemberEvaluationResponse } from './response/member-evaluation-admin-get-list.response';
import { MemberEvaluationAdminGetDetailResponse } from './response/member-evaluation-admin-get-detail.response';

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
                    Site: {
                        name: siteQuery.keywordBySiteName && { contains: siteQuery.keywordBySiteName },
                        Company: {
                            name: siteQuery.keywordByCompanyName && { contains: siteQuery.keywordByCompanyName },
                        },
                    },
                };
                break;
            case EvaluationType.TEAM:
                const teamQuery = query as TeamEvaluationAdminGetListRequest;
                whereConditions = {
                    isActive: true,
                    Team: {
                        name: teamQuery.keywordByTeamName && { contains: teamQuery.keywordByTeamName },
                        leader: {
                            name: teamQuery.keywordByLeaderName && { contains: teamQuery.keywordByLeaderName },
                        },
                    },
                };
                break;
            case EvaluationType.MEMBER:
                const memberQuery = query as MemberEvaluationAdminGetListRequest;
                whereConditions = {
                    isActive: true,
                    Member: {
                        name: memberQuery.keywordByName && { contains: memberQuery.keywordByName },
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
            where: this.parseConditionsFromQuery(EvaluationType.SITE, query),
            orderBy,
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
        return siteEvaluations.map((item) => {
            return {
                id: item.id,
                companyName: item.Site.Company.name,
                siteName: item.Site.name,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });
    }

    async getSiteEvaluationDetail(id: number): Promise<SiteEvaluationAdminGetDetailResponse> {
        const siteEvaluation = await this.prismaService.siteEvaluation.findUnique({
            select: {
                totalEvaluators: true,
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
                            },
                        },
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
            return {
                name: item.Member.name,
                username: item.Member.account.username,
                contact: item.Member.contact,
                score: item.score,
            };
        });
        return {
            companyName: siteEvaluation.Site.Company.name,
            siteName: siteEvaluation.Site.name,
            address: siteEvaluation.Site.address,
            contact: siteEvaluation.Site.contact,
            personInCharge: siteEvaluation.Site.personInCharge,
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
                Team: {
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
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
        return teamEvaluations.map((item) => {
            return {
                id: item.id,
                teamName: item.Team.name,
                leaderName: item.Team.leader.name,
                totalMembers: item.Team.totalMembers,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });
    }

    async getTeamEvaluationDetail(id: number): Promise<TeamEvaluationAdminGetDetailResponse> {
        const teamEvaluation = await this.prismaService.teamEvaluation.findUnique({
            select: {
                totalEvaluators: true,
                averageScore: true,
                Team: {
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
                TeamEvaluationByCompany: {
                    select: {
                        score: true,
                        Site: {
                            select: {
                                name: true,
                                contact: true,
                                personInCharge: true,
                                Company: {
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
        const listOfEvaluators = teamEvaluation.TeamEvaluationByCompany.map((item) => {
            return {
                companyName: item.Site.Company.name,
                siteName: item.Site.name,
                siteContact: item.Site.contact,
                personInCharge: item.Site.personInCharge,
                score: item.score,
            };
        });
        return {
            teamName: teamEvaluation.Team.name,
            leaderName: teamEvaluation.Team.leader.name,
            totalMembers: teamEvaluation.Team.totalMembers,
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
                Member: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
            },
            where: this.parseConditionsFromQuery(EvaluationType.MEMBER, query),
            orderBy,
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
        return (await memberEvaluations).map((item) => {
            return {
                id: item.id,
                name: item.Member.name,
                contact: item.Member.contact,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });
    }

    async getMemberEvaluationDetail(id: number): Promise<MemberEvaluationAdminGetDetailResponse> {
        const memberEvaluation = await this.prismaService.memberEvaluation.findUnique({
            select: {
                totalEvaluators: true,
                averageScore: true,
                Member: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
                MemberEvaluationByCompany: {
                    select: {
                        score: true,
                        Site: {
                            select: {
                                name: true,
                                contact: true,
                                personInCharge: true,
                                Company: {
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
        const listOfEvaluators = memberEvaluation.MemberEvaluationByCompany.map((item) => {
            return {
                companyName: item.Site.Company.name,
                siteName: item.Site.name,
                siteContact: item.Site.contact,
                personInCharge: item.Site.personInCharge,
                score: item.score,
            };
        });
        return {
            name: memberEvaluation.Member.name,
            contact: memberEvaluation.Member.contact,
            totalEvaluators: memberEvaluation.totalEvaluators,
            averageScore: memberEvaluation.averageScore,
            listOfEvaluators,
        };
    }
}
