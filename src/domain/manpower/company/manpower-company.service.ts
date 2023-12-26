import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { ManpowerCompanyGetListRequest } from './request/manpower-company-get-list.request';
import { ExperienceType, Prisma } from '@prisma/client';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ManpowerResponse } from './response/manpower-company-get-list.response';

@Injectable()
export class ManpowerCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionFromQuery(query: ManpowerCompanyGetListRequest): Prisma.MemberWhereInput {
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

    async getList(query: ManpowerCompanyGetListRequest): Promise<ManpowerResponse[]> {
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
            where: this.parseConditionFromQuery(query),
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

    async getTotal(query: ManpowerCompanyGetListRequest): Promise<number> {
        return await this.prismaService.member.count({
            where: this.parseConditionFromQuery(query),
        });
    }
}
