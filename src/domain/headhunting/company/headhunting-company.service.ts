import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { RecommendationCompanyGetListHeadhuntingApprovedRequest } from '../admin/request/recommendation-company-get-list-headhunting-approved.request';
import { RecommendationCompanyGetListHeadhuntingApprovedResponse } from '../admin/response/recommendation-company-get-list-headhunting-approved.response';

@Injectable()
export class HeadhuntingCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    async getListRecommendation(
        accountId: number,
        postId: number,
        query: RecommendationCompanyGetListHeadhuntingApprovedRequest,
    ): Promise<RecommendationCompanyGetListHeadhuntingApprovedResponse> {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId,
                isActive: true,
                companyId: account.company.id,
            },
        });

        if (!post) throw new BadRequestException('No post found');

        const queryFilter: Prisma.HeadhuntingRecommendationWhereInput = {
            postId,
            ...(query.name && { OR: [{ member: { name: query.name } }, { team: { name: query.name } }] }),
        };

        const list = await this.prismaService.headhuntingRecommendation.findMany({
            select: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        totalExperienceMonths: true,
                        totalExperienceYears: true,
                        specialLicenses: true,
                        desiredSalary: true,
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
                    },
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        leader: {
                            select: {
                                contact: true,
                                totalExperienceMonths: true,
                                totalExperienceYears: true,
                                specialLicenses: true,
                                desiredSalary: true,
                            },
                        },
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
                    },
                },
            },
            where: queryFilter,

            orderBy: {
                assignedAt: 'desc',
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const newList = list.map((item) => {
            const district = item.member.district;
            delete item.member.district;
            return {
                ...item,
                member: {
                    ...item.member,
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
        });

        const listCount = await this.prismaService.headhuntingRecommendation.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(newList, new PageInfo(listCount));
    }
}
