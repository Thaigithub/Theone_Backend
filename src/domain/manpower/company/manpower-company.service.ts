import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { ManpowerCompanyGetListRequest } from './request/manpower-company-get-list.request';
import { ExperienceType } from '@prisma/client';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ManpowerResponse } from './response/manpower-company-get-list.response';

@Injectable()
export class ManpowerCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

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
            where: {
                AND: [
                    {
                        OR: query.experienceTypeList && [
                            {
                                totalExperienceYears: query.experienceTypeList.includes(ExperienceType.SHORT)
                                    ? { gte: 1, lte: 4 }
                                    : undefined,
                            },
                            {
                                totalExperienceYears: query.experienceTypeList.includes(ExperienceType.MEDIUM)
                                    ? { gte: 5, lte: 9 }
                                    : undefined,
                            },
                            {
                                totalExperienceYears: query.experienceTypeList.includes(ExperienceType.LONG)
                                    ? { gte: 10, lte: 1000 }
                                    : undefined,
                            },
                        ],
                    },
                    {
                        OR: query.keyword && [
                            {
                                desiredOccupation: {
                                    codeName: { contains: query.keyword },
                                },
                            },
                            {
                                district: {
                                    OR: [
                                        {
                                            englishName: { contains: query.keyword },
                                        },
                                        {
                                            city: {
                                                englishName: { contains: query.keyword },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
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

    async getTotal(): Promise<number> {
        return await this.prismaService.member.count({
            where: {
                isActive: true,
            },
        });
    }
}
