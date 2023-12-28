import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, InterviewStatus, PostApplicationStatus, Prisma, SupportCategory } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ManpowerCompanyGetListMembersRequest } from './request/manpower-company-get-list-members.request';
import { ManpowerCompanyGetListTeamsRequest } from './request/manpower-company-get-list-teams.request';
import { ManpowerCompanyProposeInterviewRequest } from './request/manpower-company-propose-interview.request';
import { ManpowerListMembersResponse } from './response/manpower-company-get-list-members.response';
import { ManpowerListTeamsResponse } from './response/manpower-company-get-list-teams.response';
import { ManpowerCompanyGetMemberDetailResponse } from './response/manpower-company-get-member-detail.response';
import { ManpowerCompanyGetTeamDetailResponse } from './response/manpower-company-get-team-detail.response';
import { InterviewProposalType } from './dto/manpower-company-interview-proposal-type.enum';

@Injectable()
export class ManpowerCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionFromQueryOfMembers(query: ManpowerCompanyGetListMembersRequest): Prisma.MemberWhereInput {
        if (query.regionList) {
            (query.regionList as string[]).map(async (region) => {
                const [cityCode] = region.split('-');
                const isNationwide = await this.prismaService.city.count({
                    where: {
                        isActive: true,
                        id: parseInt(cityCode),
                        englishName: 'Nationwide',
                    },
                });
                if (isNationwide) query.regionList = undefined;
            });
        }

        return {
            isActive: true,
            AND: [
                {
                    OR: query.experienceTypeList && [
                        {
                            totalExperienceYears: query.experienceTypeList.includes(ExperienceType.SHORT)
                                ? { gte: 1, lte: 4 }
                                : null,
                        },
                        {
                            totalExperienceYears: query.experienceTypeList?.includes(ExperienceType.MEDIUM)
                                ? { gte: 5, lte: 9 }
                                : null,
                        },
                        {
                            totalExperienceYears: query.experienceTypeList?.includes(ExperienceType.LONG)
                                ? { gte: 10, lte: 1000 }
                                : null,
                        },
                    ],
                },
                {
                    OR: query.keyword && [
                        {
                            desiredOccupation: {
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
                    OR:
                        query.regionList &&
                        (query.regionList as string[]).map((region) => {
                            const [cityCode, districtCode] = region.split('-');
                            return {
                                district: {
                                    id: parseInt(districtCode),
                                    city: {
                                        id: parseInt(cityCode),
                                    },
                                },
                            };
                        }),
                },
            ],
        };
    }

    private parseConditionFromQueryOfTeams(query: ManpowerCompanyGetListTeamsRequest): Prisma.TeamWhereInput {
        if (query.regionList) {
            (query.regionList as string[]).map(async (region) => {
                const [cityCode] = region.split('-');
                const isNationwide = await this.prismaService.city.count({
                    where: {
                        isActive: true,
                        id: parseInt(cityCode),
                        englishName: 'Nationwide',
                    },
                });
                if (isNationwide) query.regionList = undefined;
            });
        }

        return {
            isActive: true,
            AND: [
                {
                    OR: query.experienceTypeList && [
                        {
                            leader: {
                                totalExperienceYears: query.experienceTypeList.includes(ExperienceType.SHORT)
                                    ? { gte: 1, lte: 4 }
                                    : null,
                            },
                        },
                        {
                            leader: {
                                totalExperienceYears: query.experienceTypeList?.includes(ExperienceType.MEDIUM)
                                    ? { gte: 5, lte: 9 }
                                    : null,
                            },
                        },
                        {
                            leader: {
                                totalExperienceYears: query.experienceTypeList?.includes(ExperienceType.LONG)
                                    ? { gte: 10, lte: 1000 }
                                    : null,
                            },
                        },
                    ],
                },
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
                    OR:
                        query.regionList &&
                        (query.regionList as string[]).map((region) => {
                            const [cityCode, districtCode] = region.split('-');
                            return {
                                district: {
                                    id: parseInt(districtCode),
                                    city: {
                                        id: parseInt(cityCode),
                                    },
                                },
                            };
                        }),
                },
                {
                    totalMembers: { lte: query.numberOfMembers },
                },
            ],
        };
    }

    async getListMembers(query: ManpowerCompanyGetListMembersRequest): Promise<ManpowerListMembersResponse[]> {
        const members = await this.prismaService.member.findMany({
            select: {
                id: true,
                name: true,
                contact: true,
                desiredSalary: true,
                totalExperienceYears: true,
                totalExperienceMonths: true,
                desiredOccupation: {
                    select: {
                        codeName: true,
                    },
                },
                certificates: true,
                specialLicenses: true,
                applyPosts: {
                    select: {
                        contract: {
                            select: {
                                endDate: true,
                            },
                        },
                    },
                    orderBy: {
                        contract: {
                            endDate: 'desc',
                        },
                    },
                },
                _count: {
                    select: {
                        teams: true,
                    },
                },
            },
            where: this.parseConditionFromQueryOfMembers(query),
            ...QueryPagingHelper.queryPaging(query),
        });

        return members.map((item) => {
            let isWorking: boolean;
            const latestContractEndDate = item.applyPosts[0]?.contract.endDate.toISOString().split('T')[0];
            const currentDate = new Date().toISOString();
            if (!latestContractEndDate || latestContractEndDate > currentDate) isWorking = false;
            else isWorking = false;
            const occupation = item.desiredOccupation.codeName;
            const numberOfTeams = item._count.teams;
            delete item._count;
            delete item.applyPosts;
            delete item.desiredOccupation;

            return {
                ...item,
                occupation,
                isWorking,
                numberOfTeams,
            };
        });
    }

    async getTotalMembers(query: ManpowerCompanyGetListMembersRequest): Promise<number> {
        return await this.prismaService.member.count({
            where: this.parseConditionFromQueryOfMembers(query),
        });
    }

    async getListTeams(query: ManpowerCompanyGetListTeamsRequest): Promise<ManpowerListTeamsResponse[]> {
        const teams = await this.prismaService.team.findMany({
            select: {
                id: true,
                name: true,
                totalMembers: true,
                leader: {
                    select: {
                        name: true,
                        contact: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        desiredSalary: true,
                    },
                },
                posts: {
                    select: {
                        contract: {
                            select: {
                                endDate: true,
                            },
                        },
                    },
                    orderBy: {
                        contract: {
                            endDate: 'desc',
                        },
                    },
                },
            },
            where: this.parseConditionFromQueryOfTeams(query),
            ...QueryPagingHelper.queryPaging(query),
        });
        return teams.map((item) => {
            let isWorking: boolean;
            const latestContractEndDate = item.posts[0]?.contract.endDate.toISOString().split('T')[0];
            const currentDate = new Date().toISOString();
            if (!latestContractEndDate || latestContractEndDate > currentDate) isWorking = false;
            else isWorking = false;

            return {
                id: item.id,
                name: item.name,
                leaderName: item.leader.name,
                leaderContact: item.leader.contact,
                totalMembers: item.totalMembers,
                desiredSalary: item.leader.desiredSalary,
                totalExperienceYears: item.leader.totalExperienceYears,
                totalExperienceMonths: item.leader.totalExperienceMonths,
                isWorking,
            };
        });
    }

    async getTotalTeams(query: ManpowerCompanyGetListTeamsRequest): Promise<number> {
        return await this.prismaService.team.count({
            where: this.parseConditionFromQueryOfTeams(query),
        });
    }

    async getMemberDetail(id: number): Promise<ManpowerCompanyGetMemberDetailResponse> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!memberExist) throw new NotFoundException('Member does not exist');

        const member = await this.prismaService.member.findUnique({
            include: {
                account: true,
                district: {
                    include: {
                        city: true,
                    },
                },
                teams: {
                    include: {
                        team: {
                            include: {
                                leader: true,
                            },
                        },
                    },
                },
                desiredOccupation: true,
                career: true,
                certificates: {
                    include: {
                        code: true,
                        file: true,
                    },
                },
                specialLicenses: true,
                basicHealthSafetyCertificate: {
                    include: {
                        file: true,
                    },
                },
            },
            where: {
                isActive: true,
                id,
            },
        });

        return {
            name: member.name,
            username: member.account.username,
            contact: member.contact,
            email: member.email,
            occupation: member.desiredOccupation ? member.desiredOccupation.codeName : null,
            desiredSalary: member.desiredSalary,
            districtEnglishName: member.district ? member.district.englishName : null,
            districtKoreanName: member.district ? member.district.koreanName : null,
            citynglishName: member.district ? member.district.city.englishName : null,
            cityKoreanName: member.district ? member.district.city.koreanName : null,
            careers: {
                list: member.career
                    ? member.career.map((item) => {
                          return {
                              companyName: item.companyName,
                              siteName: item.siteName,
                              startWorkDate: item.startDate,
                              endWorkDate: item.endDate,
                          };
                      })
                    : null,
                total: member.career.length,
            },
            teams: {
                list: member.teams
                    ? member.teams.map((item) => {
                          return {
                              name: item.team.name,
                              totalMembers: item.team.totalMembers,
                              totalExperienceYears: item.team.leader.totalExperienceYears,
                              totalExperienceMonths: item.team.leader.totalExperienceMonths,
                          };
                      })
                    : null,
                total: member.teams.length,
            },
            basicHealthAndSafetyEducation: {
                registrationNumber: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.registrationNumber
                    : null,
                dateOfCompletion: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.dateOfCompletion
                    : null,
                keyOfPhoto: member.basicHealthSafetyCertificate ? member.basicHealthSafetyCertificate.file.key : null,
            },
            certificates: {
                list: member.certificates
                    ? member.certificates.map((item) => {
                          return {
                              qualification: item.code.codeName,
                              certificateNumber: item.certificateNumber,
                              keyOfPhoto: item.file.key,
                          };
                      })
                    : null,
                total: member.certificates.length,
            },
            construcionEquiments: {
                list: member.specialLicenses
                    ? member.specialLicenses.map((item) => {
                          return {
                              deviceName: item.name,
                              registrationNumber: item.licenseNumber,
                          };
                      })
                    : null,
                total: member.specialLicenses.length,
            },
        };
    }

    async getTeamDetail(id: number): Promise<ManpowerCompanyGetTeamDetailResponse> {
        const teamExist = await this.prismaService.team.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!teamExist) throw new NotFoundException('Team does not exist');

        const team = await this.prismaService.team.findUnique({
            include: {
                leader: true,
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

        const [leader] = team.members.filter((item) => {
            return item.memberId === team.leaderId;
        });

        const listMembers = team.members.filter((item) => {
            return item.memberId !== team.leaderId;
        });
        listMembers.unshift(leader);

        return {
            name: team.name,
            totalMembers: team.totalMembers,
            contact: team.leader.contact,
            districtEnglishName: team.district ? team.district.englishName : null,
            districtKoreanName: team.district ? team.district.koreanName : null,
            cityEnglishName: team.district ? team.district.city.englishName : null,
            cityKoreanName: team.district ? team.district.city.koreanName : null,
            members: {
                list: listMembers.map((item) => {
                    return {
                        id: item.member.id,
                        name: item.member.name,
                        contact: item.member.contact,
                        totalExperienceYears: item.member.totalExperienceYears,
                        totalExperienceMonths: item.member.totalExperienceMonths,
                        occupation: item.member.desiredOccupation ? item.member.desiredOccupation.codeName : null,
                        districtEnglishName: item.member.district ? item.member.district.englishName : null,
                        districtKoreanName: item.member.district ? item.member.district.koreanName : null,
                        cityEnglishName: item.member.district ? item.member.district.city.englishName : null,
                        cityKoreanName: item.member.district ? item.member.district.city.koreanName : null,
                    };
                }),
                total: listMembers.length,
            },
        };
    }

    async proposeInterview(body: ManpowerCompanyProposeInterviewRequest): Promise<void> {
        const postExist = await this.prismaService.post.count({
            where: {
                isActive: true,
                id: body.postId,
            },
        });
        if (!postExist) throw new NotFoundException('Post does not exist');

        switch (body.interviewProposalType) {
            case InterviewProposalType.MEMBER:
                const memberExist = await this.prismaService.member.count({
                    where: {
                        isActive: true,
                        id: body.id,
                    },
                });
                if (!memberExist) throw new NotFoundException('Member does not exist');
                break;
            case InterviewProposalType.TEAM:
                const teamExist = await this.prismaService.team.count({
                    where: {
                        isActive: true,
                        id: body.id,
                    },
                });
                if (!teamExist) throw new NotFoundException('Team does not exist');
                break;
        }

        const newApplication = await this.prismaService.application.create({
            data: {
                memberId: body.interviewProposalType === InterviewProposalType.MEMBER ? body.id : null,
                teamId: body.interviewProposalType === InterviewProposalType.TEAM ? body.id : null,
                postId: body.postId,
                status: PostApplicationStatus.PROPOSAL_INTERVIEW,
            },
        });

        await this.prismaService.interview.create({
            data: {
                supportCategory: SupportCategory.MANPOWER,
                applicationId: newApplication.id,
                interviewStatus: InterviewStatus.INTERVIEWING,
            },
        });
    }
}
