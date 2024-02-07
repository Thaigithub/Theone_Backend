import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HeadhuntingRequestStatus, PaymentStatus, PostCategory, Prisma, ProductType, RefundStatus } from '@prisma/client';
import { MemberCompanyService } from 'domain/member/company/member-company.service';
import { TeamCompanyService } from 'domain/team/company/team-company.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { HeadhuntingCompanyCreateRequestRequest } from './request/headhunting-company-create-request.request';
import { HeadhuntingCompanyGetListRecommendationRequest } from './request/headhunting-company-get-list-recommendation.request';
import { HeadhuntingCompanyGetDetailRequestResponse } from './response/headhunting-company-get-detail-request.response';
import { HeadhuntingCompanyGetListRecommendationResponse } from './response/headhunting-company-get-list-recommendation.response';
import { HeadhuntingCompanyGetRecommendationDetailResponse } from './response/headhunting-company-get-recommendation-detail.response';

@Injectable()
export class HeadhuntingCompanyService {
    constructor(
        private prismaService: PrismaService,
        private memberCompanyService: MemberCompanyService,
        private teamCompanyService: TeamCompanyService,
    ) {}

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
        if (!headhunting) throw new NotFoundException(Error.HEADHUNTING_NOT_FOUND);

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
                id: true,
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
                        account: {
                            select: {
                                isActive: true,
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
                                account: {
                                    select: {
                                        isActive: true,
                                    },
                                },
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
                        isActive: true,
                    },
                },
            },
            where: queryFilter,

            orderBy: {
                assignedAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });

        console.log(list);

        const newList = list.map((item) => {
            if (item.member) {
                const region = item.member.region;
                delete item.member.region;
                return {
                    headhuntingRecommendationId: item.id,
                    team: null,
                    member: {
                        id: item.member.id,
                        name: item.member.name,
                        contact: item.member.contact,
                        totalExperienceMonths: item.member.totalExperienceMonths,
                        totalExperienceYears: item.member.totalExperienceYears,
                        desiredSalary: item.member.desiredSalary,
                        licenses: item.member.licenses.map((license) => {
                            return {
                                name: license.code.name,
                                licenseNumber: license.licenseNumber,
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
                        isActive: item.member.account.isActive,
                    },
                };
            } else {
                const region = item.team.region;
                delete item.team.region;
                return {
                    headhuntingRecommendationId: item.id,
                    member: null,
                    team: {
                        id: item.team.id,
                        name: item.team.name,
                        leader: {
                            contact: item.team.leader.contact,
                            licenses: item.team.leader.licenses.map((license) => {
                                return {
                                    name: license.code.name,
                                    licenseNumber: license.licenseNumber,
                                };
                            }),
                            totalExperienceMonths: item.team.leader.totalExperienceMonths,
                            totalExperienceYears: item.team.leader.totalExperienceYears,
                            desiredSalary: item.team.leader.desiredSalary,
                            isActive: item.team.leader.account.isActive,
                        },
                        city: {
                            englishName: region?.cityEnglishName || null,
                            koreanName: region?.cityKoreanName || null,
                        },
                        district: {
                            englishName: region?.districtEnglishName || null,
                            koreanName: region?.districtKoreanName || null,
                        },
                        isActive: item.team.isActive,
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
            throw new BadRequestException(Error.HEADHUNTING_NOT_FOUND);
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
                company: {
                    accountId,
                },
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
            throw new BadRequestException(Error.PRODUCT_NOT_FOUND);
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
                throw new BadRequestException(Error.HEADHUNTING_REQUEST_EXISTED);
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

    async getRecommendationDetail(accountId: number, id: number): Promise<HeadhuntingCompanyGetRecommendationDetailResponse> {
        const headhuntingRecommendation = await this.prismaService.headhuntingRecommendation.findFirst({
            where: {
                id,
                headhunting: {
                    post: {
                        company: {
                            accountId,
                        },
                    },
                },
            },
            select: {
                memberId: true,
                teamId: true,
            },
        });

        if (!headhuntingRecommendation) {
            throw new NotFoundException(Error.HEADHUNTING_RECOMMENDATION_NOT_FOUND);
        }

        if (headhuntingRecommendation.memberId) {
            const member = await this.memberCompanyService.getDetail(accountId, headhuntingRecommendation.memberId, false);
            return {
                member,
                team: null,
            };
        } else {
            const team = await this.teamCompanyService.getDetail(accountId, headhuntingRecommendation.teamId, false);
            return {
                member: null,
                team,
            };
        }
    }
}
