import { Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus, ExperienceType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TeamCompanyManpowerGetListRequest } from './request/team-company-manpower-get-list.request';
import { TeamCompanyManpowerGetDetailResponse } from './response/team-company-manpower-get-detail.response';
import { ManpowerListTeamsResponse } from './response/team-company-manpower-get-list.response';

@Injectable()
export class TeamCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionFromQuery(query: TeamCompanyManpowerGetListRequest): Prisma.TeamWhereInput {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupation?.map((item) => parseInt(item));
        const districtList = query.regionList?.map((item) => parseInt(item.split('-')[1]));

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
                    code: query.occupation && { id: { in: occupationList } },
                },
                {
                    district: query.regionList && { id: { in: districtList } },
                },
                {
                    totalMembers: query.numberOfMembers && { lte: query.numberOfMembers },
                },
            ],
        };
    }

    private async getListSpecialLicensesOfTeam(teamId: number): Promise<{ licenseNumber: string; codeName: string }[]> {
        const team = await this.prismaService.team.findUnique({
            include: {
                leader: {
                    include: {
                        specialLicenses: {
                            include: {
                                code: true,
                            },
                            where: {
                                status: CertificateStatus.APPROVED,
                            },
                        },
                    },
                },
                members: {
                    include: {
                        member: {
                            include: {
                                specialLicenses: {
                                    include: {
                                        code: true,
                                    },
                                    where: {
                                        status: CertificateStatus.APPROVED,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                isActive: true,
                id: teamId,
            },
        });

        const leaderSpecialLicenses = team.leader.specialLicenses
            ? team.leader.specialLicenses.map((item) => {
                  return {
                      licenseNumber: item.licenseNumber,
                      codeName: item.code.codeName,
                  };
              })
            : [];
        let membersSpecialLicences = team.members
            .map((item) => {
                if (item.member.specialLicenses) {
                    return {
                        licenseNumber: item.member.specialLicenses.map((item) => {
                            return {
                                licenseNumber: item.licenseNumber,
                                codeName: item.code.codeName,
                            };
                        }),
                    };
                }
            })
            .map((item) => {
                return item.licenseNumber;
            })
            .flat(1);
        membersSpecialLicences = membersSpecialLicences.concat(leaderSpecialLicenses);
        return membersSpecialLicences;
    }

    async getList(query: TeamCompanyManpowerGetListRequest): Promise<ManpowerListTeamsResponse[]> {
        const teams = await this.prismaService.team.findMany({
            include: {
                leader: true,
                district: {
                    include: {
                        city: true,
                    },
                },
            },
            where: this.parseConditionFromQuery(query),
            ...QueryPagingHelper.queryPaging(query),
        });
        return teams.map((item) => {
            return {
                id: item.id,
                name: item.name,
                totalMembers: item.totalMembers,
                cityKoreanName: item.district.city.koreanName,
                districtKoreanName: item.district.koreanName,
                leaderContact: item.leader.contact,
                totalExperienceYears: item.totalExperienceYears,
                totalExperienceMonths: item.totalExperienceMonths,
                desiredSalary: item.desiredSalary,
            };
        });
    }

    async getTotal(query: TeamCompanyManpowerGetListRequest): Promise<number> {
        return await this.prismaService.team.count({
            where: this.parseConditionFromQuery(query),
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
                        desiredOccupations: {
                            include: {
                                code: true,
                            },
                        },
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
                                desiredOccupations: {
                                    include: {
                                        code: true,
                                    },
                                },
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
            cityKoreanName: team.district.city.koreanName,
            districtKoreanName: team.district.koreanName,
            leaderContact: team.leader.contact,
            leaderTotalExperienceYears: team.leader.totalExperienceYears,
            leaderTotalExperienceMonths: team.leader.totalExperienceMonths,
            desiredSalary: team.desiredSalary,
            members: listMembers.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    contact: item.contact,
                    totalExperienceYears: item.totalExperienceYears,
                    totalExperienceMonths: item.totalExperienceMonths,
                    desiredOccupations: item.desiredOccupations
                        ? item.desiredOccupations.map((item) => {
                              return item.code.codeName;
                          })
                        : [],
                };
            }),
            specialLicenses: await this.getListSpecialLicensesOfTeam(team.id),
        };
    }
}
