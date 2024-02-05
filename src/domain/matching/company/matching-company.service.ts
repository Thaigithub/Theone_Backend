import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestObject } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { MatchingCompanyGetListDate } from './enum/matching-company-get-list-date.enum';
import { MatchingCompanyCreateRecommendationRequest } from './request/matching-company-create-recommendation.request';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { MatchingCompanyGetListRecommendation } from './response/matching-company-get-list-recommendation.response';

@Injectable()
export class MatchingCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(
        accountId: number,
        query: MatchingCompanyGetListRecommendationRequest,
    ): Promise<MatchingCompanyGetListRecommendation> {
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
                    company: {
                        accountId,
                    },
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
                                    account: {
                                        select: {
                                            isActive: true,
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
                                                        include: {
                                                            code: true,
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
            return {
                data: [
                    ...allMembers.map((member) => {
                        return {
                            id: member.id,
                            object: RequestObject.INDIVIDUAL,
                            name: member.name,
                            contact: member.contact,
                            totalMonths: member.totalExperienceMonths,
                            totalYears: member.totalExperienceYears,
                            numberOfTeamMembers: null,
                            memberDetail: {
                                occupations: member.licenses.map((item) => item.code.name),
                                localInformation: member.address,
                                totalMonths: member.totalExperienceMonths,
                                totalYears: member.totalExperienceYears,
                                entire: member.applications?.some((application) => application.contract?.endDate > new Date())
                                    ? 'On duty'
                                    : 'Looking for a job',
                                isActive: member.account.isActive,
                            },
                            teamDetail: null,
                        };
                    }),
                    ...allTeams.map((team) => {
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
                                name: team.name,
                                occupation: team.code.name,
                                leader: {
                                    name: team.leader.name,
                                    contact: team.leader.contact,
                                    totalYears: team.leader.totalExperienceYears,
                                    totalMonths: team.leader.totalExperienceMonths,
                                    occupations: team.leader.licenses ? team.leader.licenses.map((item) => item.code.name) : [],
                                    workingStatus: team.leader.applications?.some(
                                        (application) => application.contract?.endDate > new Date(),
                                    )
                                        ? 'On duty'
                                        : 'Looking for a job',
                                    isActive: team.leader.account.isActive,
                                },
                                region: team.region,
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
                                        occupations: member.licenses.map((item) => {
                                            return item.code.name;
                                        }),
                                        isActive: member.account.isActive,
                                    };

                                    return memberResponse;
                                }),
                                isActive: team.isActive,
                            },
                        };
                    }),
                ],
            };
        }
        return { data: [] };
    }

    async create(accountId: number, query: MatchingCompanyCreateRecommendationRequest): Promise<void> {
        const occupationIds = query.occupationList || undefined;
        const regionIds =
            (query.regionList && query.regionList.map((item) => item.split('-')[1]).map((item) => parseInt(item))) || undefined;
        const request = await this.prismaService.matchingRequest.findUnique({
            where: {
                date: new Date(),
                company: {
                    accountId,
                },
            },
            select: {
                recommendations: true,
            },
        });
        console.log('request ', request);
        if (request) {
            if (
                request.recommendations.filter((item) => item.teamId).length === 5 &&
                request.recommendations.filter((item) => item.memberId).length === 10
            )
                throw new BadRequestException(Error.RECOMMENDATION_IS_FULL_TODAY);
        }
        const members = await this.prismaService.member.findMany({
            where: {
                regionId: {
                    in: regionIds,
                },
                licenses: {
                    some: {
                        code: {
                            id: {
                                in: occupationIds,
                            },
                        },
                    },
                },
                ...(request?.recommendations &&
                    request.recommendations.length > 0 && {
                        NOT: {
                            id: {
                                in: request.recommendations.filter((item) => item.memberId).map((item) => item.id),
                            },
                        },
                    }),
            },
            take: 10 - (request?.recommendations ? request.recommendations.filter((item) => item.memberId).length : 0),
        });

        const teams = await this.prismaService.team.findMany({
            where: {
                regionId: {
                    in: regionIds,
                },
                code: {
                    id: {
                        in: occupationIds,
                    },
                },
                ...(request?.recommendations &&
                    request?.recommendations.length > 0 && {
                        NOT: {
                            id: {
                                in: request.recommendations.filter((item) => item.teamId).map((item) => item.id),
                            },
                        },
                    }),
            },
            take: 5 - (request?.recommendations ? request.recommendations.filter((item) => item.teamId).length : 0),
        });

        await this.prismaService.company.update({
            data: {
                matchingRequests: {
                    create: {
                        recommendations: {
                            createMany: {
                                data: [
                                    ...members
                                        .filter(
                                            (member) =>
                                                !request.recommendations
                                                    .filter((item) => item.memberId)
                                                    .map((item) => item.id)
                                                    .includes(member.id),
                                        )
                                        .map((member) => {
                                            return { memberId: member.id };
                                        }),
                                    ...teams
                                        .filter(
                                            (team) =>
                                                !request.recommendations
                                                    .filter((item) => item.teamId)
                                                    .map((item) => item.id)
                                                    .includes(team.id),
                                        )
                                        .map((team) => {
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
    }
}
