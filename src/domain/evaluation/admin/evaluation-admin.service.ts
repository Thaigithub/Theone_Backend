import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { EvaluationAdmingetListSiteCategory } from './enum/evaluation-admin-get-list-site-category.enum';
import { EvaluationAdminGetListTeamCategory } from './enum/evaluation-admin-get-list-team-category.enum';
import { EvaluationAdminType } from './enum/evaluation-admin-type.enum';
import { EvaluationAdminGetListMemberRequest } from './request/evaluation-admin-get-list-member.request';
import { EvaluationAdminGetListSiteRequest } from './request/evaluation-admin-get-list-site.request';
import { EvaluationAdminGetListTeamRequest } from './request/evaluation-admin-get-list-team.request';
import { EvaluationAdminGetDetailMemberResponse } from './response/evaluation-admin-get-detail-member.response';
import { EvaluationAdminGetDetailSiteResponse } from './response/evaluation-admin-get-detail-site.response';
import { EvaluationAdminGetDetailTeamResponse } from './response/evaluation-admin-get-detail-team.response';
import { EvaluationAdminGetListMemberResponse } from './response/evaluation-admin-get-list-member.response';
import { EvaluationAdminGetListSiteResponse } from './response/evaluation-admin-get-list-site.response';
import { EvaluationAdminGetListTeamResponse } from './response/evaluation-admin-get-list-team.response';

@Injectable()
export class EvaluationAdminService {
    constructor(private prismaService: PrismaService) {}

    private parseConditionsFromQuery(
        evaluationType: EvaluationAdminType,
        query: EvaluationAdminGetListSiteRequest | EvaluationAdminGetListTeamRequest | EvaluationAdminGetListMemberRequest,
    ) {
        let whereConditions = {};
        switch (evaluationType) {
            case EvaluationAdminType.SITE:
                const siteQuery = query as EvaluationAdminGetListSiteRequest;
                whereConditions = {
                    isActive: true,
                    site: {
                        name:
                            siteQuery.searchCategory === EvaluationAdmingetListSiteCategory.SITE_NAME
                                ? {
                                      contains: siteQuery.keyword,
                                  }
                                : undefined,
                        company: {
                            name:
                                siteQuery.searchCategory === EvaluationAdmingetListSiteCategory.COMPANY_NAME
                                    ? {
                                          contains: siteQuery.keyword,
                                      }
                                    : undefined,
                        },
                    },
                };
                break;
            case EvaluationAdminType.TEAM:
                const teamQuery = query as EvaluationAdminGetListTeamRequest;
                whereConditions = {
                    isActive: true,
                    team: {
                        name:
                            teamQuery.searchCategory === EvaluationAdminGetListTeamCategory.TEAM_NAME
                                ? {
                                      contains: teamQuery.keyword,
                                  }
                                : undefined,
                        leader: {
                            name:
                                teamQuery.searchCategory === EvaluationAdminGetListTeamCategory.LEADER_NAME
                                    ? {
                                          contains: teamQuery.keyword,
                                      }
                                    : undefined,
                        },
                    },
                };
                break;
            case EvaluationAdminType.MEMBER:
                const memberQuery = query as EvaluationAdminGetListMemberRequest;
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
        evaluationType: EvaluationAdminType,
        query: EvaluationAdminGetListSiteRequest | EvaluationAdminGetListTeamRequest | EvaluationAdminGetListMemberRequest,
    ) {
        let count: number;
        switch (evaluationType) {
            case EvaluationAdminType.SITE:
                count = await this.prismaService.siteEvaluation.count({
                    where: this.parseConditionsFromQuery(evaluationType, query),
                });
                break;
            case EvaluationAdminType.TEAM:
                count = await this.prismaService.teamEvaluation.count({
                    where: this.parseConditionsFromQuery(evaluationType, query),
                });
                break;
            case EvaluationAdminType.MEMBER:
                count = await this.prismaService.memberEvaluation.count({
                    where: this.parseConditionsFromQuery(evaluationType, query),
                });
                break;
        }
        return count;
    }

    async getListSite(query: EvaluationAdminGetListSiteRequest): Promise<EvaluationAdminGetListSiteResponse> {
        const orderBy = this.handleOrderBy(query.isHighestRating);
        const siteEvaluations = (
            await this.prismaService.siteEvaluation.findMany({
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
                where: this.parseConditionsFromQuery(EvaluationAdminType.SITE, query),
                orderBy,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                companyName: item.site.company.name,
                siteName: item.site.name,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });

        const total = await this.getTotal(EvaluationAdminType.SITE, query);
        return new PaginationResponse(siteEvaluations, new PageInfo(total));
    }

    async getDetailSite(id: number): Promise<EvaluationAdminGetDetailSiteResponse> {
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
                siteEvaluationsByContracts: {
                    select: {
                        score: true,
                        contract: {
                            select: {
                                application: {
                                    select: {
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
                        },
                    },
                },
            },
            where: {
                isActive: true,
                id,
            },
        });
        const listOfEvaluators = siteEvaluation.siteEvaluationsByContracts.map((item) => {
            return {
                name: item.contract.application.member.name,
                username: item.contract.application.member.account.username,
                contact: item.contract.application.member.contact,
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

    async getListTeam(@Query() query: EvaluationAdminGetListTeamRequest): Promise<EvaluationAdminGetListTeamResponse> {
        const orderBy = this.handleOrderBy(query.isHighestRating);
        const teamEvaluations = (
            await this.prismaService.teamEvaluation.findMany({
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
                where: this.parseConditionsFromQuery(EvaluationAdminType.TEAM, query),
                orderBy,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                teamName: item.team.name,
                leaderName: item.team.leader.name,
                totalMembers: item.team.totalMembers,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });

        const total = await this.getTotal(EvaluationAdminType.TEAM, query);
        return new PaginationResponse(teamEvaluations, new PageInfo(total));
    }

    async getDetailTeam(id: number): Promise<EvaluationAdminGetDetailTeamResponse> {
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
                teamEvaluationsByCompanies: {
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
        const listOfEvaluators = teamEvaluation.teamEvaluationsByCompanies.map((item) => {
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

    async getListMember(@Query() query: EvaluationAdminGetListMemberRequest): Promise<EvaluationAdminGetListMemberResponse> {
        const orderBy = this.handleOrderBy(query.isHighestRating);
        const memberEvaluations = (
            await this.prismaService.memberEvaluation.findMany({
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
                where: this.parseConditionsFromQuery(EvaluationAdminType.MEMBER, query),
                orderBy,
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.member.name,
                contact: item.member.contact,
                totalEvaluators: item.totalEvaluators,
                averageScore: item.averageScore,
            };
        });

        const total = await this.getTotal(EvaluationAdminType.MEMBER, query);
        return new PaginationResponse(memberEvaluations, new PageInfo(total));
    }

    async getDetailMember(id: number): Promise<EvaluationAdminGetDetailMemberResponse> {
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
                memberEvaluationsByCompanies: {
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
        const listOfEvaluators = memberEvaluation.memberEvaluationsByCompanies.map((item) => {
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
