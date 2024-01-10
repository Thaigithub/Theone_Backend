import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { MemberCompanyManpowerGetListRequest } from './request/member-company-manpower-get-list.request';
import { MemberCompanyCountWorkersResponse } from './response/member-company-get-count-worker.response';
import { MemberCompanyManpowerGetDetailResponse } from './response/member-company-manpower-get-detail.response';
import { ManpowerListMembersResponse } from './response/member-company-manpower-get-list.response';
import { RegionService } from 'domain/region/region.service';

@Injectable()
export class MemberCompanyService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly regionService: RegionService,
    ) {}

    private async parseConditionFromQuery(query: MemberCompanyManpowerGetListRequest): Promise<Prisma.MemberWhereInput> {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupation?.map((item) => parseInt(item));
        const { districtsList, citiesList } = await this.regionService.parseFromRegionList(query.regionList);

        return {
            isActive: true,
            AND: [
                {
                    OR: query.keyword && [
                        {
                            desiredOccupations: {
                                some: {
                                    code: {
                                        codeName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                },
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
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.SHORT)
                                ? { not: null, gte: 1, lte: 4 }
                                : undefined,
                        },
                        {
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.MEDIUM)
                                ? { not: null, gte: 5, lte: 9 }
                                : undefined,
                        },
                        {
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.LONG)
                                ? { not: null, gte: 10 }
                                : undefined,
                        },
                    ],
                },
                {
                    desiredOccupations: query.occupation && {
                        some: {
                            code: { id: { in: occupationList } },
                        },
                    },
                },
                {
                    OR: [
                        districtsList.length
                            ? {
                                  district: {
                                      id: { in: districtsList },
                                  },
                              }
                            : {},
                        citiesList.length
                            ? {
                                  district: {
                                      cityId: { in: citiesList },
                                  },
                              }
                            : {},
                    ],
                },
            ],
        };
    }

    async getList(query: MemberCompanyManpowerGetListRequest): Promise<ManpowerListMembersResponse[]> {
        const members = await this.prismaService.member.findMany({
            include: {
                specialLicenses: true,
                district: {
                    include: {
                        city: true,
                    },
                },
            },
            where: await this.parseConditionFromQuery(query),
            ...QueryPagingHelper.queryPaging(query),
        });

        return members.map((item) => {
            return {
                id: item.id,
                name: item.name,
                contact: item.contact,
                desiredSalary: item.desiredSalary,
                cityKoreanName: item.district ? item.district.city.koreanName : null,
                districtKoreanName: item.district ? item.district.city.koreanName : null,
                totalExperienceYears: item.totalExperienceYears,
                totalExperienceMonths: item.totalExperienceMonths,
                specialLicenses: item.specialLicenses,
            };
        });
    }

    async getTotal(query: MemberCompanyManpowerGetListRequest): Promise<number> {
        return await this.prismaService.member.count({
            where: await this.parseConditionFromQuery(query),
        });
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
                desiredOccupations: {
                    include: {
                        code: true,
                    },
                },
                career: {
                    include: {
                        occupation: true,
                    },
                },
                specialLicenses: {
                    include: {
                        code: true,
                    },
                },
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
            cityKoreanName: member.district ? member.district.city.koreanName : null,
            districtKoreanName: member.district ? member.district.koreanName : null,
            desiredSalary: member.desiredSalary,
            totalExperienceYears: member.totalExperienceYears,
            totalExperienceMonths: member.totalExperienceMonths,
            desiredOccupations: member.desiredOccupations
                ? member.desiredOccupations.map((item) => {
                      return item.code.codeName;
                  })
                : [],
            careers: member.career
                ? member.career.map((item) => {
                      return {
                          startDate: item.startDate,
                          endDate: item.endDate,
                          companyName: item.companyName,
                          siteName: item.siteName,
                          codeName: item.occupation.codeName,
                      };
                  })
                : [],
            specialLicenses: member.specialLicenses
                ? member.specialLicenses.map((item) => {
                      return {
                          codeName: item.code.codeName,
                          licenseNumber: item.licenseNumber,
                      };
                  })
                : [],
            basicHealthAndSafetyEducation: {
                registrationNumber: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.registrationNumber
                    : null,
                dateOfCompletion: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.dateOfCompletion
                    : null,
                photo: {
                    fileName: member.basicHealthSafetyCertificate ? member.basicHealthSafetyCertificate.file.fileName : null,
                    type: member.basicHealthSafetyCertificate ? member.basicHealthSafetyCertificate.file.type : null,
                    key: member.basicHealthSafetyCertificate ? member.basicHealthSafetyCertificate.file.key : null,
                    size: member.basicHealthSafetyCertificate ? Number(member.basicHealthSafetyCertificate.file.size) : null,
                },
            },
        };
    }

    async countWorkers(accountId: number): Promise<MemberCompanyCountWorkersResponse> {
        const workers = await this.prismaService.member.count({
            where: {
                applyPosts: {
                    some: {
                        post: {
                            company: {
                                accountId: accountId,
                            },
                        },
                        contract: {
                            startDate: {
                                lte: new Date(),
                            },
                            endDate: {
                                gte: new Date(),
                            },
                        },
                    },
                },
            },
        });
        return { countWorkers: workers };
    }
}
