import { Injectable } from '@nestjs/common';
import { RequestObject } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { MatchingCompanyGetListDate } from './enum/matching-company-get-list-date.enum';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { MatchingCompanyGetListRecommendation } from './response/matching-company-get-list-recommendation.response';

@Injectable()
export class MatchingCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(
        accountId: number,
        query: MatchingCompanyGetListRecommendationRequest,
    ): Promise<MatchingCompanyGetListRecommendation> {
        const occupationIds = (query.occupation && query.occupation.split(',')) || null;
        const regionIds = (query.region && query.region.split(',')) || null;

        console.log('MATCHING QUERY', query, occupationIds, regionIds);
        const dateQuery: Date = new Date();
        switch (query.date) {
            case MatchingCompanyGetListDate.ONE_DAY_AGO:
                dateQuery.setDate(dateQuery.getDate() - 1);
                break;
            case MatchingCompanyGetListDate.TWO_DAYS_AGO:
                dateQuery.setDate(dateQuery.getDate() - 2);
                break;
            case MatchingCompanyGetListDate.THREE_DAYS_AGO:
                dateQuery.setDate(dateQuery.getDate() - 3);
                break;
            default:
                break;
        }
        const existMatching = (
            await this.prismaService.matchingRequest.findMany({
                where: {
                    date: dateQuery,
                },
                select: {
                    recommendations: {
                        select: {
                            member: {
                                select: {
                                    id: true,
                                    name: true,
                                    contact: true,
                                    licenses: {
                                        where: {
                                            isActive: true,
                                        },
                                        include: {
                                            code: true,
                                        },
                                    },
                                    address: true,
                                    totalExperienceMonths: true,
                                    totalExperienceYears: true,
                                    applications: {
                                        include: {
                                            contract: true,
                                        },
                                    },
                                },
                            },
                            team: {
                                include: {
                                    leader: true,
                                    code: true,
                                    members: {
                                        include: {
                                            member: {
                                                include: {
                                                    licenses: {
                                                        where: {
                                                            isActive: true,
                                                        },
                                                    },
                                                    applications: {
                                                        include: {
                                                            contract: true,
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
            })
        ).reduce((accum, item) => {
            accum.push(...item.recommendations);
            return accum;
        }, []);

        if (existMatching.length > 0) {
            const allMembers = existMatching.filter((matching) => !matching.team).map((matching) => matching.member);
            const allTeams = existMatching.filter((matching) => !matching.member).map((matching) => matching.team);
            return this.mappingResponseDTO(allMembers, allTeams);
        }

        if (!existMatching.length && query.date === MatchingCompanyGetListDate.TODAY) {
            const members = await this.prismaService.member.findMany({
                include: {
                    licenses: {
                        where: {
                            isActive: true,
                        },
                    },
                    applications: {
                        include: {
                            contract: true,
                        },
                    },
                },
                take: 10,
            });

            const teams = await this.prismaService.team.findMany({
                include: {
                    leader: true,
                    members: {
                        include: {
                            member: {
                                include: {
                                    licenses: {
                                        where: {
                                            isActive: true,
                                        },
                                    },
                                    applications: {
                                        include: {
                                            contract: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                take: 5,
            });

            await this.prismaService.company.update({
                data: {
                    matchingRequests: {
                        create: {
                            recommendations: {
                                createMany: {
                                    data: [
                                        ...members.map((member) => {
                                            return { memberId: member.id };
                                        }),
                                        ...teams.map((team) => {
                                            return { teamId: team.id };
                                        }),
                                    ],
                                },
                            },
                        },
                    },
                },
                where: {
                    accountId,
                },
            });
            return this.mappingResponseDTO(members, teams);
        }
    }

    mappingResponseDTO(members, teams): MatchingCompanyGetListRecommendation {
        const response: MatchingCompanyGetListRecommendation = {
            data: [
                ...members.map((member) => {
                    return {
                        id: member.id,
                        object: RequestObject.INDIVIDUAL,
                        name: member.name,
                        contact: member.contact,
                        totalMonths: member.totalExperienceMonths,
                        totalYears: member.totalExperienceYears,
                        numberOfTeamMembers: null,
                        memberDetail: {
                            codeName: member.licenses.map((code) => code.name),
                            localInformation: member.address,
                            totalMonths: member.totalExperienceMonths,
                            totalYears: member.totalExperienceYears,
                            entire: member.applications?.some((application) => application.contract?.endDate > new Date())
                                ? 'On duty'
                                : 'Looking for a job',
                        },
                        teamDetail: null,
                    };
                }),
                ...teams.map((team) => {
                    return {
                        id: team.id,
                        object: RequestObject.TEAM,
                        name: team.name,
                        contact: team.leader.contact,
                        totalMonths: team.totalExperienceMonths,
                        totalYears: team.totalExperienceYears,
                        numberOfTeamMembers: team.members.length + 1,
                        memberDetail: null,
                        teamDetail: {
                            codeName: team.code.name,
                            leaderName: team.leader.name,
                            leaderContact: team.leader.contact,
                            leaderAddress: team.leader.address,
                            totalYears: team.totalExperienceYears,
                            totalMonths: team.totalExperienceMonths,
                            member: team.members.map((memberTeam) => {
                                const member = memberTeam.member;
                                const memberResponse = {
                                    rank: member.id === team.leaderId ? 'TEAM LEADER' : 'TEAM MEMBER',
                                    name: member.name,
                                    contact: member.contact,
                                    totalYears: member.totalExperienceYears,
                                    totalMonths: member.totalExperienceMonths,
                                    workingStatus: member.applications?.some(
                                        (application) => application.contract?.endDate > new Date(),
                                    )
                                        ? 'On duty'
                                        : 'Looking for a job',
                                };

                                return memberResponse;
                            }),
                        },
                    };
                }),
            ],
        };

        return response;
    }
}
