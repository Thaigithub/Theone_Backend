import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, Prisma } from '@prisma/client';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { MemberCompanyManpowerGetListRequest } from './request/menber-company-manpower-get-list.request';
import { ManpowerListMembersResponse } from './response/member-company-manpower-get-list.response';
import { MemberCompanyManpowerGetDetailResponse } from './response/menber-company-manpower-get-detail.response';

@Injectable()
export class MemberCompanyService {
    constructor(private prismaService: PrismaService) {}

    private parseConditionFromQuery(query: MemberCompanyManpowerGetListRequest): Prisma.MemberWhereInput {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupationList?.map((item) => parseInt(item));
        const regionList = query.regionList?.map((item) => parseInt(item));

        return {
            isActive: true,
            AND: [
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
                    desiredOccupation: query.occupationList && { id: { in: occupationList } },
                },
                {
                    district: query.regionList && { id: { in: regionList } },
                },
            ],
        };
    }

    async getList(query: MemberCompanyManpowerGetListRequest): Promise<ManpowerListMembersResponse[]> {
        const members = await this.prismaService.member.findMany({
            include: {
                desiredOccupation: true,
                certificates: true,
                specialLicenses: true,
                applyPosts: {
                    include: {
                        contract: true,
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
            where: this.parseConditionFromQuery(query),
            ...QueryPagingHelper.queryPaging(query),
        });

        return members.map((item) => {
            let isWorking: boolean;
            const latestContractEndDate = item.applyPosts[0]?.contract?.endDate.toISOString().split('T')[0];
            const currentDate = new Date().toISOString().split('T')[0];
            if (!latestContractEndDate || latestContractEndDate < currentDate) isWorking = false;
            else isWorking = true;

            return {
                id: item.id,
                name: item.name,
                contact: item.contact,
                desiredSalary: item.desiredSalary,
                occupation: item.desiredOccupation && item.desiredOccupation.codeName,
                totalExperienceYears: item.totalExperienceYears,
                totalExperienceMonths: item.totalExperienceMonths,
                isWorking,
                numberOfTeams: item._count.teams,
                certificates: item.certificates,
                specialLicenses: item.specialLicenses,
            };
        });
    }

    async getTotal(query: MemberCompanyManpowerGetListRequest): Promise<number> {
        return await this.prismaService.member.count({
            where: this.parseConditionFromQuery(query),
        });
    }

    async getMemberDetail(accountId: number, id: number): Promise<ApplicationCompanyGetMemberDetail> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const application = await this.prismaService.application.findUniqueOrThrow({
            where: {
                id,
                post: {
                    companyId: account.company.id,
                },
            },
            select: {
                member: {
                    select: {
                        name: true,
                        contact: true,
                        email: true,
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
                        desiredSalary: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        account: {
                            select: {
                                username: true,
                            },
                        },
                        career: {
                            select: {
                                companyName: true,
                                siteName: true,
                                occupation: true,
                                startDate: true,
                                endDate: true,
                                experiencedYears: true,
                                experiencedMonths: true,
                            },
                        },
                        certificates: {
                            select: {
                                name: true,
                                certificateNumber: true,
                            },
                        },
                        specialLicenses: {
                            select: {
                                name: true,
                                licenseNumber: true,
                            },
                        },
                        basicHealthSafetyCertificate: {
                            select: {
                                registrationNumber: true,
                                dateOfCompletion: true,
                                file: true,
                            },
                        },
                    },
                },
                interview: {
                    select: {
                        interviewStatus: true,
                    },
                },
            },
        });
        const district = application.member.district;
        delete application.member.district;

        return {
            ...application,
            member: {
                ...application.member,
                city: {
                    englishName: district.city.englishName,
                    koreanName: district.city.koreanName,
                },
                district: {
                    englishName: district.englishName,
                    koreanName: district.koreanName,
                },
            },
        };
    }

    async getMemberDetailManpower(id: number): Promise<MemberCompanyManpowerGetDetailResponse> {
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
}
