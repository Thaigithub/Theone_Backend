/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, Prisma } from '@prisma/client';
import { RegionService } from 'domain/region/region.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { MemberCompanyGetListRequest } from './request/member-company-get-list.request';
import { MemberCompanyCountWorkersResponse } from './response/member-company-get-count-worker.response';
import { MemberCompanyGetDetailResponse } from './response/member-company-get-detail.response';
import { MemberCompanyGetListResponse } from './response/member-company-get-list.response';

@Injectable()
export class MemberCompanyService {
    constructor(
        private prismaService: PrismaService,
        private regionService: RegionService,
    ) {}

    private async parseConditionFromQuery(query: MemberCompanyGetListRequest): Promise<Prisma.MemberWhereInput> {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupation?.map((item) => parseInt(item));
        const { ids } = await this.regionService.parseFromRegionList(query.regionList);

        return {
            isActive: true,
            AND: [
                {
                    OR: query.keyword && [
                        {
                            licenses: {
                                some: {
                                    code: {
                                        name: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                },
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
                    ...(occupationList &&
                        occupationList.length > 0 && {
                            licenses: {
                                some: {
                                    code: {
                                        id: { in: occupationList },
                                    },
                                },
                            },
                        }),
                },
                {
                    ...(ids &&
                        ids.length > 0 && {
                            region: {
                                id: { in: ids },
                            },
                        }),
                },
            ],
        };
    }

    async getList(query: MemberCompanyGetListRequest): Promise<MemberCompanyGetListResponse> {
        const members = (
            await this.prismaService.member.findMany({
                include: {
                    account: {
                        select: {
                            isActive: true,
                        },
                    },
                    licenses: {
                        where: {
                            isActive: true,
                        },
                        include: {
                            code: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    },
                    region: {
                        select: {
                            districtKoreanName: true,
                            cityKoreanName: true,
                        },
                    },
                },
                where: await this.parseConditionFromQuery(query),
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.name,
                contact: item.contact,
                desiredSalary: item.desiredSalary,
                cityKoreanName: item.region ? item.region.cityKoreanName : null,
                districtKoreanName: item.region ? item.region.districtKoreanName : null,
                totalExperienceYears: item.totalExperienceYears,
                totalExperienceMonths: item.totalExperienceMonths,
                licenses: item.licenses,
                occupations: item.licenses.map((item)=>{return item.code.name;}),
                isActive: item.account.isActive,
            };
        });
        const total = await this.prismaService.member.count({
            where: await this.parseConditionFromQuery(query),
        });
        return new PaginationResponse(members, new PageInfo(total));
    }

    async getDetail(id: number): Promise<MemberCompanyGetDetailResponse> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!memberExist) throw new NotFoundException(Error.MEMBER_NOT_FOUND);

        const member = await this.prismaService.member.findUnique({
            include: {
                account: true,
                region: {
                    select: {
                        districtEnglishName: true,
                        districtKoreanName: true,
                        cityEnglishName: true,
                        cityKoreanName: true,
                    },
                },
                careers: {
                    include: {
                        code: true,
                    },
                },
                licenses: {
                    where: {
                        isActive: true,
                    },
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
            district: {
                englishName: member.region ? member.region.districtEnglishName : null,
                koreanName: member.region ? member.region.districtKoreanName : null,
            },
            city: {
                englishName: member.region ? member.region.cityEnglishName : null,
                koreanName: member.region ? member.region.cityKoreanName : null,
            },
            desiredSalary: member.desiredSalary,
            totalExperienceYears: member.totalExperienceYears,
            totalExperienceMonths: member.totalExperienceMonths,
            careers: member.careers
                ? member.careers.map((item) => {
                      return {
                          startDate: item.startDate,
                          endDate: item.endDate,
                          companyName: item.companyName,
                          siteName: item.siteName,
                          occupation: item.code.name,
                      };
                  })
                : [],
            licenses: member.licenses
                ? member.licenses.map((item) => {
                      return {
                          codeName: item.code.name,
                          licenseNumber: item.licenseNumber,
                      };
                  })
                : [],
                occupations:member.licenses.map(item=>item.code.name),
            basicHealthSafetyCertificate: {
                registrationNumber: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.registrationNumber
                    : null,
                dateOfCompletion: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.dateOfCompletion
                    : null,
                file: {
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
                applications: {
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
