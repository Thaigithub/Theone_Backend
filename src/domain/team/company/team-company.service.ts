import { Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus, ExperienceType, MemberLevel, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
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
            leader: {
                NOT: { level: { in: Array<MemberLevel>(MemberLevel.GOLD, MemberLevel.PLATINUM, MemberLevel.SILVER) } },
            },
        } as Prisma.TeamWhereInput;
    }

    private async isTeamInformationRevealable(accountId: number, teamId: number): Promise<boolean> {
        const headhuntingRecommendation = await this.prismaService.headhuntingRecommendation.findFirst({
            where: {
                teamId,
                headhunting: {
                    post: {
                        company: {
                            accountId,
                        },
                    },
                },
            },
        });

        console.log(headhuntingRecommendation);

        if (headhuntingRecommendation) return true;

        const matchingReommendation = await this.prismaService.matchingRecommendation.findFirst({
            where: {
                teamId,
                matchingRequest: {
                    company: {
                        accountId,
                    },
                },
            },
        });

        console.log(matchingReommendation);

        if (matchingReommendation) return true;

        return false;
    }

    async getList(accountId: number, query: TeamCompanyGetListRequest): Promise<TeamCompanyGetListResponse> {
        const records = await this.prismaService.team.findMany({
            include: {
                leader: {
                    include: {
                        memberInformationRequests: {
                            where: {
                                company: {
                                    accountId,
                                },
                            },
                        },
                    },
                },
                region: {
                    select: {
                        districtKoreanName: true,
                        cityKoreanName: true,
                    },
                },
            },
            where: this.parseConditionFromQuery(query),
            ...QueryPagingHelper.queryPaging(query),
        });

        const teams = await Promise.all(
            records.map(async (item) => {
                const isChecked =
                    item.leader.memberInformationRequests.length > 0 ||
                    (await this.isTeamInformationRevealable(accountId, item.id));

                return {
                    id: item.id,
                    name: item.name,
                    totalMembers: item.totalMembers,
                    cityKoreanName: item.region.cityKoreanName,
                    districtKoreanName: item.region.districtKoreanName,
                    leader: {
                        contact: isChecked ? item.leader.contact : null,
                        isChecked,
                    },
                    totalExperienceYears: item.totalExperienceYears,
                    totalExperienceMonths: item.totalExperienceMonths,
                    desiredSalary: item.desiredSalary,
                };
            }),
        );
        const total = await this.prismaService.team.count({
            where: this.parseConditionFromQuery(query),
        });
        return new PaginationResponse(teams, new PageInfo(total));
    }

    async getDetail(accountId: number, id: number, checkInformationRequired: boolean): Promise<TeamCompanyGetDetailResponse> {
        const teamExist = await this.prismaService.team.count({
            where: {
                isActive: true,
                id,
                OR: [
                    {
                        headhuntingRecommendations: {
                            some: {
                                headhunting: {
                                    post: {
                                        company: {
                                            accountId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        matchingRecommendations: {
                            some: {
                                matchingRequest: {
                                    company: {
                                        accountId,
                                    },
                                },
                            },
                        },
                    },
                    {
                        leader: {
                            NOT: {
                                level: { in: Array<MemberLevel>(MemberLevel.GOLD, MemberLevel.PLATINUM, MemberLevel.SILVER) },
                            },
                        },
                    },
                ],
            },
        });

        if (!teamExist) throw new NotFoundException(Error.TEAM_NOT_FOUND);

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
                        region: {
                            select: {
                                cityKoreanName: true,
                                districtKoreanName: true,
                            },
                        },
                        memberInformationRequests: {
                            where: {
                                company: {
                                    accountId,
                                },
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
                                    where: {
                                        status: CertificateStatus.APPROVED,
                                        isActive: true,
                                    },
                                },
                                region: {
                                    select: {
                                        cityKoreanName: true,
                                        districtKoreanName: true,
                                    },
                                },
                                memberInformationRequests: {
                                    where: {
                                        company: {
                                            accountId,
                                        },
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

        if (await this.isTeamInformationRevealable(accountId, id)) checkInformationRequired = false;

        const isAdminChecked = checkInformationRequired ? team.leader.memberInformationRequests.length > 0 : true;

        const license = [];
        for (const member of listMembers) {
            const isChecked = checkInformationRequired ? member.memberInformationRequests.length > 0 : true;
            if (member.licenses) {
                for (const item of member.licenses) {
                    license.push({
                        licenseNumber: isChecked ? item.licenseNumber : null,
                        codeName: isChecked ? item.code.name : null,
                    });
                }
            }
        }

        return {
            name: team.name,
            totalMembers: team.totalMembers,
            cityKoreanName: team.region.cityKoreanName,
            districtKoreanName: team.region.districtKoreanName,
            leaderContact: isAdminChecked ? team.leader.contact : null,
            leader: {
                contact: isAdminChecked ? team.leader.contact : null,
                isChecked: isAdminChecked,
            },
            leaderTotalExperienceYears: team.leader.totalExperienceYears,
            leaderTotalExperienceMonths: team.leader.totalExperienceMonths,
            desiredSalary: team.desiredSalary,
            members: listMembers.map((item) => {
                const isMemberChecked = checkInformationRequired ? item.memberInformationRequests.length > 0 : true;

                return {
                    id: item.id,
                    name: item.name,
                    contact: isMemberChecked ? item.contact : null,
                    totalExperienceYears: item.totalExperienceYears,
                    totalExperienceMonths: item.totalExperienceMonths,
                    desiredOccupations: item.licenses
                        ? item.licenses.map((item) => {
                              return item.code.name;
                          })
                        : [],
                    licenses: item.licenses
                        ? item.licenses.map((license) => {
                              return {
                                  licenseNumber: isMemberChecked ? license.licenseNumber : null,
                                  codeName: isMemberChecked ? license.code.name : null,
                              };
                          })
                        : [],
                    isChecked: isMemberChecked,
                };
            }),
            licenses: team.leader.licenses.map((license) => {
                return {
                    licenseNumber: isAdminChecked ? license.licenseNumber : null,
                    codeName: isAdminChecked ? license.code.name : null,
                };
            }),
        };
    }
}
