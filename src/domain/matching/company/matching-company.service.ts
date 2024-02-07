import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, RequestObject } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { MatchingCompanyGetListDate } from './enum/matching-company-get-list-date.enum';
import { MatchingCompanyCreateRecommendationRequest } from './request/matching-company-create-recommendation.request';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { MatchingCompanyGetListRecommendation } from './response/matching-company-get-list-recommendation.response';

@Injectable()
export class MatchingCompanyService {
    constructor(private prismaService: PrismaService) {}

    filterExperience(types: ExperienceType[], totalExperienceMonths: number): boolean {
        for (const type of types) {
            if (type === ExperienceType.REGARDLESS && totalExperienceMonths <= 12) {
                return true;
            } else if (type === ExperienceType.SHORT && totalExperienceMonths > 12 && totalExperienceMonths <= 60) {
                return true;
            } else if (type === ExperienceType.MEDIUM && totalExperienceMonths > 60 && totalExperienceMonths <= 120) {
                return true;
            } else if (type === ExperienceType.LONG && totalExperienceMonths > 120) {
                return true;
            }
        }
        return false;
    }

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
                                    leader: {
                                        select: {
                                            account: {
                                                select: {
                                                    isActive: true,
                                                },
                                            },
                                        },
                                    },
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
                                                    account: {
                                                        select: {
                                                            isActive: true,
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
        const occupationIds = query.occupationList && query.occupationList.length > 0 ? query.occupationList : undefined;
        const parseRegions =
            (query.regionList && query.regionList.map((item) => item.split('-')[1]).map((item) => parseInt(item))) || undefined;
        const regionIds = parseRegions && parseRegions.length > 0 ? parseRegions : undefined;

        const company = await this.prismaService.company.findUnique({
            where: {
                accountId: accountId,
                isActive: true,
            },
            select: {
                id: true,
            },
        });
        if (!company) {
            throw new NotFoundException(Error.ACCOUNT_NOT_FOUND);
        }
        const request = await this.prismaService.matchingRequest.findUnique({
            where: {
                date_companyId: {
                    date: new Date(),
                    companyId: company.id,
                },
            },
            select: {
                recommendations: true,
            },
        });
        if (request) {
            if (
                request.recommendations.filter((item) => item.teamId).length === 5 &&
                request.recommendations.filter((item) => item.memberId).length === 10
            )
                throw new BadRequestException(Error.RECOMMENDATION_IS_FULL_TODAY);
        }
        const recommendationHistories = (
            await this.prismaService.matchingRecommendation.findMany({
                where: {
                    matchingRequest: {
                        companyId: company.id,
                    },
                    NOT: {
                        AND: [{ teamId: null }, { memberId: null }],
                    },
                },
                select: {
                    memberId: true,
                    teamId: true,
                },
            })
        ).map((item) => {
            if (item.memberId) {
                return {
                    memberId: item.memberId,
                };
            }
            return {
                teamId: item.teamId,
            };
        });

        // Get Member and Team match the conditions
        const members = (
            await this.prismaService.member.findMany({
                where: {
                    ...(regionIds && {
                        regionId: {
                            in: regionIds,
                        },
                    }),
                    ...(occupationIds && {
                        licenses: {
                            some: {
                                code: {
                                    id: {
                                        in: occupationIds,
                                    },
                                },
                            },
                        },
                    }),
                    ...(query.keyword && {
                        OR: [
                            { name: { contains: query.keyword, mode: 'insensitive' } },
                            { contact: { contains: query.keyword, mode: 'insensitive' } },
                        ],
                    }),
                    ...(request?.recommendations &&
                        request.recommendations.length > 0 && {
                            NOT: {
                                id: {
                                    in: request.recommendations.filter((item) => item.memberId).map((item) => item.id),
                                },
                            },
                        }),
                    isActive: true,
                },
                select: {
                    id: true,
                    desiredSalary: true,
                    totalExperienceYears: true,
                    totalExperienceMonths: true,
                    applications: {
                        where: {
                            contract: {
                                startDate: {
                                    lt: new Date(),
                                },
                            },
                            ...(occupationIds &&
                                occupationIds.length > 0 && {
                                    post: {
                                        codeId: { in: occupationIds },
                                    },
                                }),
                        },
                        select: {
                            contract: {
                                select: {
                                    startDate: true,
                                    endDate: true,
                                },
                            },
                        },
                    },
                },
            })
        )
            .filter((member) => {
                if (recommendationHistories.length === 0) {
                    return true;
                }
                return !recommendationHistories
                    .filter((item) => item.memberId)
                    .map((item) => item.memberId)
                    .includes(member.id);
            })
            .filter(async (item) => {
                // Career experience only (not care about occupations)
                if (
                    query.careerList &&
                    query.careerList.length > 0 &&
                    (!query.occupationList || query.occupationList.length === 0)
                ) {
                    // Calculate experience
                    const totalExperienceMonths = Math.max(
                        item.totalExperienceYears * 12 + item.totalExperienceMonths,
                        item.applications.reduce((sum, current) => {
                            const today = new Date();
                            const endDate = current.contract.endDate > today ? today : current.contract.endDate;
                            return (
                                sum +
                                ((endDate.getFullYear() - current.contract.startDate.getFullYear()) * 12 +
                                    endDate.getMonth() -
                                    current.contract.startDate.getMonth() +
                                    1)
                            );
                        }, 0),
                    );
                    return this.filterExperience(query.careerList, totalExperienceMonths);
                }
                // Total experiences of specific occupations.
                else if (
                    query.careerList &&
                    query.careerList.length > 0 &&
                    query.occupationList &&
                    query.occupationList.length > 0
                ) {
                    const totalExperienceMonths = item.applications.reduce((sum, current) => {
                        const today = new Date();
                        const endDate = current.contract.endDate > today ? today : current.contract.endDate;
                        return (
                            sum +
                            ((endDate.getFullYear() - current.contract.startDate.getFullYear()) * 12 +
                                endDate.getMonth() -
                                current.contract.startDate.getMonth() +
                                1)
                        );
                    }, 0);
                    return this.filterExperience(query.careerList, totalExperienceMonths);
                }
                return true;
            })
            .sort((a, b) => {
                return query.salary ? Math.abs(a.desiredSalary - query.salary) - Math.abs(b.desiredSalary - query.salary) : 0;
            })
            .slice(0, 10 - (request?.recommendations ? request.recommendations.filter((item) => item.memberId).length : 0))
            .map((member) => {
                return { memberId: member.id };
            });

        // Get team recommendations
        const teams = (
            await this.prismaService.team.findMany({
                where: {
                    ...(regionIds && {
                        regionId: {
                            in: regionIds,
                        },
                    }),
                    ...(occupationIds && {
                        code: {
                            id: {
                                in: occupationIds,
                            },
                        },
                    }),
                    ...(request?.recommendations &&
                        request?.recommendations.length > 0 && {
                            NOT: {
                                id: {
                                    in: request.recommendations.filter((item) => item.teamId).map((item) => item.id),
                                },
                            },
                        }),
                    ...(query.keyword && {
                        OR: [
                            { name: { contains: query.keyword, mode: 'insensitive' } },
                            { leader: { contact: { contains: query.keyword, mode: 'insensitive' } } },
                        ],
                    }),
                    isActive: true,
                },
                select: {
                    id: true,
                    desiredSalary: true,
                    totalExperienceYears: true,
                    totalExperienceMonths: true,
                    applications: {
                        where: {
                            contract: {
                                endDate: { lte: new Date() },
                            },
                            ...(occupationIds &&
                                occupationIds.length > 0 && {
                                    post: {
                                        codeId: { in: occupationIds },
                                    },
                                }),
                        },
                        select: {
                            contract: {
                                select: {
                                    startDate: true,
                                    endDate: true,
                                },
                            },
                        },
                    },
                },
            })
        )
            .filter((team) => {
                if (recommendationHistories.length === 0) {
                    return true;
                }
                return !recommendationHistories
                    .filter((item) => item.teamId)
                    .map((item) => item.teamId)
                    .includes(team.id);
            })
            .filter((item) => {
                // Career experience only (not care about occupations)
                if (
                    query.careerList &&
                    query.careerList.length > 0 &&
                    (!query.occupationList || query.occupationList.length === 0)
                ) {
                    const totalExperienceMonths = Math.max(
                        item.totalExperienceYears * 12 + item.totalExperienceMonths,
                        item.applications.reduce((sum, current) => {
                            const today = new Date();
                            const endDate = current.contract.endDate > today ? today : current.contract.endDate;
                            return (
                                sum +
                                ((endDate.getFullYear() - current.contract.startDate.getFullYear()) * 12 +
                                    endDate.getMonth() -
                                    current.contract.startDate.getMonth() +
                                    1)
                            );
                        }, 0),
                    );
                    return this.filterExperience(query.careerList, totalExperienceMonths);
                }
                // Total experiences of specific occupations.
                else if (
                    query.careerList &&
                    query.careerList.length > 0 &&
                    query.occupationList &&
                    query.occupationList.length > 0
                ) {
                    const totalExperienceMonths = item.applications.reduce((sum, current) => {
                        const today = new Date();
                        const endDate = current.contract.endDate > today ? today : current.contract.endDate;
                        return (
                            sum +
                            ((endDate.getFullYear() - current.contract.startDate.getFullYear()) * 12 +
                                endDate.getMonth() -
                                current.contract.startDate.getMonth() +
                                1)
                        );
                    }, 0);
                    return this.filterExperience(query.careerList, totalExperienceMonths);
                }
                return true;
            })
            .sort((a, b) => {
                return query.salary ? Math.abs(a.desiredSalary - query.salary) - Math.abs(b.desiredSalary - query.salary) : 0;
            })
            .slice(0, 5 - (request?.recommendations ? request.recommendations.filter((item) => item.teamId).length : 0))
            .map((team) => {
                return { teamId: team.id };
            });
        if (teams.length + members.length === 0) {
            throw new NotFoundException(Error.RECOMMENDATION_NOT_FOUND_RESULT);
        }
        await this.prismaService.matchingRequest.upsert({
            where: {
                date_companyId: {
                    date: new Date(),
                    companyId: company.id,
                },
            },
            create: {
                date: new Date(),
                companyId: company.id,
                recommendations: {
                    createMany: {
                        data: [...members, ...teams],
                    },
                },
            },
            update: {
                recommendations: {
                    createMany: {
                        data: [...members, ...teams],
                    },
                },
            },
        });
    }
}
