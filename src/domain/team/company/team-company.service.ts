import { Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus, ExperienceType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TeamCompanyGetListRequest } from './request/team-company-get-list.request';
import { TeamCompanyGetDetailResponse } from './response/team-company-get-detail.response';
import { TeamCompanyGetListResponse } from './response/team-company-get-list.response';

@Injectable()
export class TeamCompanyService {
    constructor(private prismaService: PrismaService) {}

    private parseConditionFromQuery(query: TeamCompanyGetListRequest): Prisma.TeamWhereInput {
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
                                name: { contains: query.keyword, mode: 'insensitive' },
                            },
                        },
                        {
                            region: {
                                OR: [
                                    {
                                        districtEnglishName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        districtKoreanName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        cityEnglishName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        cityKoreanName: { contains: query.keyword, mode: 'insensitive' },
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
                    region: query.regionList && { id: { in: districtList } },
                },
                {
                    totalMembers: query.numberOfMembers && { lte: query.numberOfMembers },
                },
            ],
        };
    }

    private async getListLicensesOfTeam(teamId: number): Promise<{ licenseNumber: string; codeName: string }[]> {
        const team = await this.prismaService.team.findUnique({
            include: {
                leader: {
                    include: {
                        licenses: {
                            include: {
                                code: true,
                            },
                            where: {
                                status: CertificateStatus.APPROVED,
                                isActive: true,
                            },
                        },
                    },
                },
                members: {
                    include: {
                        member: {
                            include: {
                                licenses: {
                                    include: {
                                        code: true,
                                    },
                                    where: {
                                        status: CertificateStatus.APPROVED,
                                        isActive: true,
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

        const leaderLicenses = team.leader.licenses
            ? team.leader.licenses.map((item) => {
                  return {
                      licenseNumber: item.licenseNumber,
                      codeName: item.code.name,
                  };
              })
            : [];
        let membersLicences = team.members
            .map((item) => {
                if (item.member.licenses) {
                    return {
                        licenseNumber: item.member.licenses.map((item) => {
                            return {
                                licenseNumber: item.licenseNumber,
                                codeName: item.code.name,
                            };
                        }),
                    };
                }
            })
            .map((item) => {
                return item.licenseNumber;
            })
            .flat(1);
        membersLicences = membersLicences.concat(leaderLicenses);
        return membersLicences;
    }

    async getList(query: TeamCompanyGetListRequest): Promise<TeamCompanyGetListResponse> {
        const teams = (
            await this.prismaService.team.findMany({
                include: {
                    leader: true,
                    region: {
                        select: {
                            districtKoreanName: true,
                            cityKoreanName: true,
                        },
                    },
                },
                where: this.parseConditionFromQuery(query),
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.name,
                totalMembers: item.totalMembers,
                cityKoreanName: item.region.cityKoreanName,
                districtKoreanName: item.region.districtKoreanName,
                leaderContact: item.leader.contact,
                totalExperienceYears: item.totalExperienceYears,
                totalExperienceMonths: item.totalExperienceMonths,
                desiredSalary: item.desiredSalary,
            };
        });
        const total = await this.prismaService.team.count({
            where: this.parseConditionFromQuery(query),
        });
        return new PaginationResponse(teams, new PageInfo(total));
    }

    async getDetail(id: number): Promise<TeamCompanyGetDetailResponse> {
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
                        licenses: {
                            include: {
                                code: true,
                            },
                        },
                        region: {
                            select: {
                                cityKoreanName: true,
                                districtKoreanName: true,
                            },
                        },
                    },
                },
                region: {
                    select: {
                        cityKoreanName: true,
                        districtKoreanName: true,
                    },
                },
                members: {
                    include: {
                        member: {
                            include: {
                                licenses: {
                                    include: {
                                        code: true,
                                    },
                                },
                                region: {
                                    select: {
                                        cityKoreanName: true,
                                        districtKoreanName: true,
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
            cityKoreanName: team.region.cityKoreanName,
            districtKoreanName: team.region.districtKoreanName,
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
                    desiredOccupations: item.licenses
                        ? item.licenses.map((item) => {
                              return item.code.name;
                          })
                        : [],
                };
            }),
            licenses: await this.getListLicensesOfTeam(team.id),
        };
    }
}
