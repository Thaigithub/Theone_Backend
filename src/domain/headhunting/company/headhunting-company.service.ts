import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HeadhuntingRequestStatus, PaymentStatus, PostCategory, Prisma, ProductType, RefundStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { HeadhuntingCompanyCreateRequestRequest } from './request/headhunting-company-create-request.request';
import { HeadhuntingCompanyGetListRecommendationRequest } from './request/headhunting-company-get-list-recommendation.request';
import { HeadhuntingCompanyGetDetailRequestResponse } from './response/headhunting-company-get-detail-request.response';
import { HeadhuntingCompanyGetListRecommendationResponse } from './response/headhunting-company-get-list-recommendation.response';

@Injectable()
export class HeadhuntingCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getListRecommendation(
        accountId: number,
        id: number,
        query: HeadhuntingCompanyGetListRecommendationRequest,
    ): Promise<HeadhuntingCompanyGetListRecommendationResponse> {
        const headhunting = await this.prismaService.headhunting.findUnique({
            where: {
                id,
                post: {
                    company: {
                        accountId,
                    },
                },
            },
        });
        if (!headhunting) throw new NotFoundException('Headhunting not found');

        const queryFilter: Prisma.HeadhuntingRecommendationWhereInput = {
            headhunting: {
                id,
                isActive: true,
            },
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
                        licenses: {
                            where: {
                                isActive: true,
                            },
                            select: {
                                licenseNumber: true,
                                code: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        desiredSalary: true,
                        region: {
                            select: {
                                districtEnglishName: true,
                                districtKoreanName: true,
                                cityEnglishName: true,
                                cityKoreanName: true,
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
                                licenses: {
                                    where: {
                                        isActive: true,
                                    },
                                    select: {
                                        code: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                        licenseNumber: true,
                                    },
                                },
                                desiredSalary: true,
                            },
                        },
                        region: {
                            select: {
                                districtEnglishName: true,
                                districtKoreanName: true,
                                cityEnglishName: true,
                                cityKoreanName: true,
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
                const region = item.member.region;
                delete item.member.region;
                const { licenses, ...rest } = item.member;
                return {
                    ...item,
                    team: null,
                    member: {
                        ...rest,
                        licenses: licenses.map((item) => {
                            return {
                                name: item.code.name,
                                licenseNumber: item.licenseNumber,
                            };
                        }),
                        city: {
                            englishName: region?.cityEnglishName || null,
                            koreanName: region?.cityKoreanName || null,
                        },
                        district: {
                            englishName: region?.districtEnglishName || null,
                            koreanName: region?.districtKoreanName || null,
                        },
                    },
                };
            } else {
                const region = item.team.region;
                delete item.team.region;
                const { leader, ...restTeam } = item.team;
                const { licenses, ...restLeader } = leader;
                return {
                    member: null,
                    team: {
                        ...restTeam,
                        leader: {
                            ...restLeader,
                            licenses: licenses.map((item) => {
                                return {
                                    name: item.code.name,
                                    licenseNumber: item.licenseNumber,
                                };
                            }),
                        },
                        city: {
                            englishName: region?.cityEnglishName || null,
                            koreanName: region?.cityKoreanName || null,
                        },
                        district: {
                            englishName: region?.districtEnglishName || null,
                            koreanName: region?.districtKoreanName || null,
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

    async getDetailRequest(accountId: number, id: number): Promise<HeadhuntingCompanyGetDetailRequestResponse> {
        return await this.prismaService.headhunting.findUnique({
            where: {
                id,
            },
            select: {
                requests: {
                    select: {
                        object: true,
                        detail: true,
                    },
                    take: 1,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                post: {
                    select: {
                        name: true,
                        experienceType: true,
                        code: {
                            select: {
                                name: true,
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

    async createRequest(accountId: number, body: HeadhuntingCompanyCreateRequestRequest, id: number): Promise<void> {
        const headhunting = await this.prismaService.headhunting.findUnique({
            where: {
                id,
                post: {
                    company: {
                        accountId,
                    },
                    category: PostCategory.HEADHUNTING,
                },
            },
        });

        if (!headhunting) {
            throw new BadRequestException('Headhunting not found');
        }

        const existRequest = await this.prismaService.headhuntingRequest.findFirst({
            where: {
                headhunting: {
                    postId: id,
                    isActive: true,
                },
                isActive: true,
                status: {
                    in: [HeadhuntingRequestStatus.APPLY, HeadhuntingRequestStatus.RE_APPLY],
                },
            },
            select: {
                id: true,
                status: true,
            },
        });
        const currentProduct = await this.prismaService.productPaymentHistory.findFirst({
            where: {
                product: {
                    productType: ProductType.HEADHUNTING_SERVICE,
                },
                remainingTimes: { gt: 0 },
                status: PaymentStatus.COMPLETE,
                OR: [{ refund: null }, { refund: { NOT: { status: RefundStatus.APPROVED } } }],
                expirationDate: { gt: new Date() },
            },
            select: {
                id: true,
                remainingTimes: true,
                expirationDate: true,
            },
            orderBy: [
                {
                    expirationDate: 'asc',
                },
                {
                    remainingTimes: 'asc',
                },
            ],
        });
        if (!currentProduct) {
            throw new BadRequestException(`The product hasn't been bought yet`);
        }

        if (!existRequest) {
            await this.prismaService.$transaction(async (prisma) => {
                await prisma.headhuntingRequest.create({
                    data: {
                        isActive: true,
                        detail: body.detail,
                        object: body.object,
                        status: HeadhuntingRequestStatus.APPLY,
                        headhunting: {
                            connect: {
                                id: id,
                            },
                        },
                        usageHistory: {
                            create: {
                                productPaymentHistoryId: currentProduct.id,
                                expirationDate: currentProduct.expirationDate,
                                remainNumbers: currentProduct.remainingTimes - 1,
                            },
                        },
                    },
                });
                await prisma.productPaymentHistory.update({
                    where: {
                        id: currentProduct.id,
                    },
                    data: {
                        remainingTimes: currentProduct.remainingTimes - 1,
                    },
                });
            });
        } else {
            if (
                existRequest.status === HeadhuntingRequestStatus.APPLY ||
                existRequest.status === HeadhuntingRequestStatus.RE_APPLY
            ) {
                throw new BadRequestException('Headhunting request is already applied');
            } else {
                await this.prismaService.$transaction(async (prisma) => {
                    await prisma.headhuntingRequest.create({
                        data: {
                            detail: body.detail,
                            object: body.object,
                            status: HeadhuntingRequestStatus.RE_APPLY,
                            headhunting: {
                                connect: {
                                    postId: id,
                                },
                            },
                            usageHistory: {
                                create: {
                                    productPaymentHistoryId: currentProduct.id,
                                    expirationDate: currentProduct.expirationDate,
                                    remainNumbers: currentProduct.remainingTimes - 1,
                                },
                            },
                        },
                    });
                    await prisma.productPaymentHistory.update({
                        where: {
                            id: currentProduct.id,
                        },
                        data: {
                            remainingTimes: currentProduct.remainingTimes - 1,
                        },
                    });
                });
            }
        }
    }
}
