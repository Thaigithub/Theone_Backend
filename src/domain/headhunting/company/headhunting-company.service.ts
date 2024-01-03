import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { HeadhuntingGetListRecommendationRequest } from './request/headhunting-company-get-list-recommendation.request';
import { RecommendationCompanyGetListHeadhuntingApprovedResponse } from './response/headhunting-company-get-list-recommendation.response';

@Injectable()
export class HeadhuntingCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    async getListRecommendation(
        accountId: number,
        postId: number,
        query: HeadhuntingGetListRecommendationRequest,
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
            OR: query.name && [
                {
                    member: {
                        name: {
                            contains: query.name,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    team: {
                        name: {
                            contains: query.name,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
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
                        specialLicenses: {
                            select: {
                                licenseNumber: true,
                                code: {
                                    select: {
                                        codeName: true,
                                    },
                                },
                            },
                        },
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
                                specialLicenses: {
                                    select: {
                                        code: {
                                            select: {
                                                codeName: true,
                                            },
                                        },
                                        licenseNumber: true,
                                    },
                                },
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
            ...QueryPagingHelper.queryPaging(query),
        });

        const newList = list.map((item) => {
            if (item.member) {
                const district = item.member.district;
                delete item.member.district;
                const { specialLicenses, ...rest } = item.member;
                return {
                    ...item,
                    team: null,
                    member: {
                        ...rest,
                        specialLicenses: specialLicenses.map((item) => {
                            return {
                                name: item.code.codeName,
                                licenseNumber: item.licenseNumber,
                            };
                        }),
                        city: {
                            englishName: district?.city.englishName || null,
                            koreanName: district?.city.koreanName || null,
                        },
                        district: {
                            englishName: district?.englishName || null,
                            koreanName: district?.koreanName || null,
                        },
                    },
                };
            } else {
                const district = item.team.district;
                delete item.team.district;
                const { specialLicenses, ...restLeader } = item.team.leader;
                const { leader, ...restTeam } = item.team;
                return {
                    member: null,
                    team: {
                        ...restTeam,
                        leader: {
                            ...leader,
                            specialLicenses: {
                                ...restLeader,
                                specialLicenses: specialLicenses.map((item) => {
                                    return {
                                        name: item.code.codeName,
                                        licenseNumber: item.licenseNumber,
                                    };
                                }),
                            },
                        },
                        city: {
                            englishName: district?.city.englishName || null,
                            koreanName: district?.city.koreanName || null,
                        },
                        district: {
                            englishName: district?.englishName || null,
                            koreanName: district?.koreanName || null,
                        },
                    },
                };
            }
        });

        const listCount = await this.prismaService.headhuntingRecommendation.count({
            where: queryFilter,
        });

        return new PaginationResponse(newList, new PageInfo(listCount));
    }

    async getDetailRequest(accountId: number, postId: number) {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        return await this.prismaService.headhuntingRequest.findUnique({
            where: {
                postId,
                isActive: true,
                post: {
                    companyId: account.company.id,
                },
            },
            select: {
                object: true,
                detail: true,
                post: {
                    select: {
                        name: true,
                        experienceType: true,
                        occupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        specialOccupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        site: {
                            select: {
                                personInCharge: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
