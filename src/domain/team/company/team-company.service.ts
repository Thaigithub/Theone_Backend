import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TeamCompanyManpowerGetListRequest } from './request/team-company-manpower-get-list.request';
import { TeamCompanyGetTeamDetailApplicants } from './response/team-company-get-team-detail.response';
import { TeamCompanyManpowerGetDetailResponse } from './response/team-company-manpower-get-detail.response';
import { ManpowerListTeamsResponse } from './response/team-company-manpower-get-list.response';

@Injectable()
export class TeamCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionFromQuery(query: TeamCompanyManpowerGetListRequest): Prisma.TeamWhereInput {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupationList?.map((item) => parseInt(item));
        const regionList = query.regionList?.map((item) => parseInt(item));

        return {
            isActive: true,
            AND: [
                {
                    OR: query.keyword && [
                        {
                            code: {
                                codeName: { contains: query.keyword, mode: 'insensitive' },
                            },
                        },
                        {
                            district: {
                                OR: [
                                    {
                                        englishName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        koreanName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        city: {
                                            englishName: { contains: query.keyword, mode: 'insensitive' },
                                        },
                                    },
                                    {
                                        city: {
                                            koreanName: { contains: query.keyword, mode: 'insensitive' },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    OR: query.experienceTypeList && [
                        {
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.SHORT) ? { gte: 1, lte: 4 } : null,
                        },
                        {
                            totalExperienceYears: experienceTypeList?.includes(ExperienceType.MEDIUM) ? { gte: 5, lte: 9 } : null,
                        },
                        {
                            totalExperienceYears: experienceTypeList?.includes(ExperienceType.LONG) ? { gte: 10 } : null,
                        },
                    ],
                },
                {
                    code: query.occupationList && { id: { in: occupationList } },
                },
                {
                    district: query.regionList && { id: { in: regionList } },
                },
                {
                    totalMembers: query.numberOfMembers && { lte: query.numberOfMembers },
                },
            ],
        };
    }

    async getList(query: TeamCompanyManpowerGetListRequest): Promise<ManpowerListTeamsResponse[]> {
        const teams = await this.prismaService.team.findMany({
            include: {
                leader: true,
                posts: {
                    include: {
                        contract: true,
                    },
                },
            },
            where: this.parseConditionFromQuery(query),
            ...QueryPagingHelper.queryPaging(query),
        });
        return teams.map((item) => {
            let isWorking: boolean;
            const latestContractEndDate = item.posts[0]?.contract?.endDate.toISOString().split('T')[0];
            const currentDate = new Date().toISOString().split('T')[0];
            if (!latestContractEndDate || latestContractEndDate < currentDate) isWorking = false;
            else isWorking = true;

            return {
                id: item.id,
                name: item.name,
                leaderName: item.leader.name,
                leaderContact: item.leader.contact,
                totalMembers: item.totalMembers,
                desiredSalary: item.desiredSalary,
                totalExperienceYears: item.totalExperienceYears,
                totalExperienceMonths: item.totalExperienceMonths,
                isWorking,
            };
        });
    }

    async getTotal(query: TeamCompanyManpowerGetListRequest): Promise<number> {
        return await this.prismaService.team.count({
            where: this.parseConditionFromQuery(query),
        });
    }

    async getTeamDetail(accountId: any, id: number): Promise<TeamCompanyGetTeamDetailApplicants> {
        return await this.prismaService.team.findUniqueOrThrow({
            where: {
                id,
            },
            select: {
                name: true,
                district: {
                    select: {
                        englishName: true,
                        koreanName: true,
                        city: {
                            select: {
                                englishName: true,
                                koreanName: true,
                            },
                        },
                    },
                },
                leader: {
                    select: {
                        contact: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        desiredSalary: true,
                        desiredOccupation: true,
                        name: true,
                    },
                },
                members: {
                    select: {
                        member: {
                            select: {
                                name: true,
                                contact: true,
                                desiredOccupation: true,
                                totalExperienceYears: true,
                                totalExperienceMonths: true,
                            },
                        },
                    },
                    orderBy: [
                        {
                            member: {
                                totalExperienceYears: 'desc',
                            },
                        },
                        {
                            member: {
                                totalExperienceMonths: 'desc',
                            },
                        },
                    ],
                },
            },
        });
    }

    async getTeamDetailManpower(id: number): Promise<TeamCompanyManpowerGetDetailResponse> {
        const teamExist = await this.prismaService.team.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!teamExist) throw new NotFoundException('Team does not exist');

        const team = await this.prismaService.team.findUnique({
            include: {
                leader: {
                    include: {
                        desiredOccupation: true,
                        district: {
                            include: {
                                city: true,
                            },
                        },
                    },
                },
                district: {
                    include: {
                        city: true,
                    },
                },
                members: {
                    include: {
                        member: {
                            include: {
                                desiredOccupation: true,
                                district: {
                                    include: {
                                        city: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: [
                        {
                            member: {
                                totalExperienceYears: 'desc',
                            },
                        },
                        {
                            member: {
                                totalExperienceMonths: 'desc',
                            },
                        },
                    ],
                },
            },
            where: {
                isActive: true,
                id,
            },
        });

        const listMembers = team.members.map((item) => {
            return item.member;
        });
        listMembers.unshift(team.leader);

        return {
            name: team.name,
            totalMembers: team.totalMembers,
            contact: team.leader.contact,
            districtEnglishName: team.district ? team.district.englishName : null,
            districtKoreanName: team.district ? team.district.koreanName : null,
            cityEnglishName: team.district ? team.district.city.englishName : null,
            cityKoreanName: team.district ? team.district.city.koreanName : null,
            members: listMembers.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    contact: item.contact,
                    totalExperienceYears: item.totalExperienceYears,
                    totalExperienceMonths: item.totalExperienceMonths,
                    occupation: item.desiredOccupation ? item.desiredOccupation.codeName : null,
                    districtEnglishName: item.district ? item.district.englishName : null,
                    districtKoreanName: item.district ? item.district.koreanName : null,
                    cityEnglishName: item.district ? item.district.city.englishName : null,
                    cityKoreanName: item.district ? item.district.city.koreanName : null,
                };
            }),
        };
    }
}
