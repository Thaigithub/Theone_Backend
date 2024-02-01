import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HeadhuntingMatchingStatus, HeadhuntingRequestStatus, Prisma, RequestObject } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { CountResponse } from 'utils/generics/count.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { HeadhuntingAdminCountCategory } from './enum/headhunting-admin-get-count-category.enum';
import { HeadhuntingAdminGetDetailRecommendationRank } from './enum/headhunting-admin-get-detail-recommendation-rank.enum';
import { HeadhuntingAdminGetListCategory } from './enum/headhunting-admin-get-list-category.enum';
import { HeadhuntingAdminGetListRequestCategory } from './enum/headhunting-admin-get-list-request-category.enum';
import { HeadhuntingAdminCreateRecommendationRequest } from './request/headhunting-admin-create-recommendation.request';
import { HeadhuntingAdminGetCountRequest } from './request/headhunting-admin-get-count.request';
import { HeadhuntingAdminGetListRequestRequest } from './request/headhunting-admin-get-list-request.request';
import { HeadhuntingAdminGetListRequest } from './request/headhunting-admin-get-list.request';
import { HeadhuntingAdminUpdatePaymentRequest } from './request/headhunting-admin-update-payment.request';
import { HeadhuntingAdminUpdateRequestStatusRequest } from './request/headhunting-admin-update-request-status.request';
import { HeadhuntingAdminGetDetailRequestResponse } from './response/headhunting-admin-get-detail-request.response';
import { HeadhuntingAdminGetDetailResponse } from './response/headhunting-admin-get-detail.response';
import { HeadhuntingAdminGetListRequestResponse } from './response/headhunting-admin-get-list-request.response';
import { HeadhuntingAdminGetListResponse } from './response/headhunting-admin-get-list.response';

@Injectable()
export class HeadhuntingAdminService {
    constructor(private prismaService: PrismaService) {}

    async getCount(query: HeadhuntingAdminGetCountRequest): Promise<CountResponse> {
        const queryFilter: Prisma.HeadhuntingRequestWhereInput = {
            ...(query.category === HeadhuntingAdminCountCategory.UNANSWERED_CASE && {
                OR: [{ status: HeadhuntingRequestStatus.APPLY }, { status: HeadhuntingRequestStatus.RE_APPLY }],
            }),
            ...(query.category === HeadhuntingAdminCountCategory.ACCEPTED_CASE && {
                status: HeadhuntingRequestStatus.APPROVED,
            }),
            ...(query.category === HeadhuntingAdminCountCategory.REJECTED_CASE && {
                status: HeadhuntingRequestStatus.REJECTED,
            }),
        };
        const count = await this.prismaService.headhuntingRequest.count({
            where: queryFilter,
        });

        return {
            count: count,
        };
    }

    async getList(query: HeadhuntingAdminGetListRequest): Promise<HeadhuntingAdminGetListResponse> {
        const queryFilter: Prisma.HeadhuntingWhereInput = {
            isActive: true,
            ...(query.category === HeadhuntingAdminGetListCategory.POST_NAME && {
                post: { name: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === HeadhuntingAdminGetListCategory.SITE_NAME && {
                post: { site: { name: { contains: query.keyword, mode: 'insensitive' } } },
            }),
            paymentStatus: query.paymentStatus,
            paymentDate: {
                gte: query.startPaymentDate && new Date(query.startPaymentDate),
                lte: query.endPaymentDate && new Date(query.endPaymentDate),
            },
            requests: {
                some: {
                    status: HeadhuntingRequestStatus.APPROVED,
                },
            },
        };

        const list = await this.prismaService.headhunting.findMany({
            select: {
                id: true,
                post: {
                    select: {
                        name: true,
                        site: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                paymentDate: true,
                paymentStatus: true,
            },
            where: queryFilter,
            orderBy: {
                updatedAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const listCount = await this.prismaService.headhunting.count({
            // Conditions based on request query
            where: queryFilter,
        });

        const responseList = list.map((item) => {
            const { post, ...rest } = item;
            const res = {
                ...rest,
                siteName: post.site?.name || null,
                postName: post.name,
            };

            return res;
        });

        return new PaginationResponse(responseList, new PageInfo(listCount));
    }

    async getListRequest(query: HeadhuntingAdminGetListRequestRequest): Promise<HeadhuntingAdminGetListRequestResponse> {
        const queryInput: Prisma.HeadhuntingRequestWhereInput = {
            isActive: true,
            date: {
                gte: query.startRequestDate && new Date(query.startRequestDate),
                lte: query.endRequestDate && new Date(query.endRequestDate),
            },
            headhunting: {
                post: {
                    name:
                        query.category && query.category === HeadhuntingAdminGetListRequestCategory.POST_NAME
                            ? { contains: query.keyword, mode: 'insensitive' }
                            : undefined,
                    site: {
                        name:
                            query.category && query.category === HeadhuntingAdminGetListRequestCategory.SITE_NAME
                                ? { contains: query.keyword, mode: 'insensitive' }
                                : undefined,
                    },
                    company: {
                        name:
                            query.category && query.category === HeadhuntingAdminGetListRequestCategory.COMPANY_NAME
                                ? { contains: query.keyword, mode: 'insensitive' }
                                : undefined,
                    },
                },
            },
            status: query.status,
        };
        const requests = (
            await this.prismaService.headhuntingRequest.findMany({
                where: queryInput,
                ...QueryPagingHelper.queryPaging(query),
                orderBy: {
                    updatedAt: 'desc',
                },
                select: {
                    id: true,
                    status: true,
                    date: true,
                    headhunting: {
                        select: {
                            post: {
                                select: {
                                    name: true,
                                    company: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    site: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                date: item.date,
                status: item.status,
                siteName: item.headhunting.post.site?.name || null,
                postName: item.headhunting.post.name,
                companyName: item.headhunting.post.company.name,
            };
        });
        const total = await this.prismaService.headhuntingRequest.count({ where: queryInput });
        return new PaginationResponse(requests, new PageInfo(total));
    }

    async getDetail(id: number): Promise<HeadhuntingAdminGetDetailResponse> {
        const headhunting = await this.prismaService.headhunting.findUnique({
            where: {
                id,
                isActive: true,
            },
            select: {
                id: true,
                post: {
                    select: {
                        experienceType: true,
                        code: true,
                        name: true,
                        company: {
                            select: {
                                name: true,
                                phone: true,
                                presentativeName: true,
                                email: true,
                            },
                        },
                        site: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                requests: {
                    take: 1,
                    orderBy: {
                        updatedAt: 'desc',
                    },
                    where: {
                        status: HeadhuntingRequestStatus.APPROVED,
                    },
                },
                paymentDate: true,
                paymentStatus: true,
                recommendations: {
                    where: {
                        NOT: {
                            settlement: null,
                        },
                    },
                    select: {
                        headhuntingRequest: {
                            select: {
                                usageHistory: {
                                    select: {
                                        productPaymentHistory: {
                                            select: {
                                                cost: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const members = (
            await this.prismaService.headhuntingRecommendation.findMany({
                where: {
                    headhuntingId: id,
                    NOT: {
                        member: null,
                    },
                },
                select: {
                    member: {
                        select: {
                            name: true,
                            contact: true,
                            address: true,
                            totalExperienceMonths: true,
                            totalExperienceYears: true,
                            licenses: {
                                select: {
                                    code: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                            account: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                    },
                    settlement: {
                        select: {
                            createdAt: true,
                        },
                    },
                },
            })
        ).map((item) => {
            const { licenses, account, ...rest } = item.member;
            return {
                ...rest,
                username: account.username,
                occupations: licenses.map((item) => item.code.name),
                matchingStatus: item.settlement ? HeadhuntingMatchingStatus.MATCHING : HeadhuntingMatchingStatus.NOT_MATCHING,
                matchingDate: item.settlement?.createdAt || null,
            };
        });
        const teams = (
            await this.prismaService.headhuntingRecommendation.findMany({
                where: {
                    headhuntingId: id,
                    NOT: {
                        team: null,
                    },
                },
                select: {
                    team: {
                        select: {
                            name: true,
                            totalMembers: true,
                            leader: {
                                select: {
                                    name: true,
                                    contact: true,
                                    address: true,
                                    totalExperienceMonths: true,
                                    totalExperienceYears: true,
                                    licenses: {
                                        select: {
                                            code: {
                                                select: {
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                    account: {
                                        select: {
                                            username: true,
                                        },
                                    },
                                },
                            },
                            members: {
                                select: {
                                    member: {
                                        select: {
                                            name: true,
                                            contact: true,
                                            address: true,
                                            totalExperienceMonths: true,
                                            totalExperienceYears: true,
                                            licenses: {
                                                select: {
                                                    code: {
                                                        select: {
                                                            name: true,
                                                        },
                                                    },
                                                },
                                            },
                                            account: {
                                                select: {
                                                    username: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    settlement: {
                        select: {
                            createdAt: true,
                        },
                    },
                },
            })
        ).map((item) => {
            return {
                name: item.team.name,
                totalMembers: item.team.totalMembers,
                members: [
                    {
                        rank: HeadhuntingAdminGetDetailRecommendationRank.LEADER,
                        name: item.team.leader.name,
                        username: item.team.leader.account.username,
                        contact: item.team.leader.contact,
                        address: item.team.leader.address,
                        occupations: item.team.leader.licenses.map((item) => item.code.name),
                        totalExperienceYears: item.team.leader.totalExperienceYears,
                        totalExperienceMonths: item.team.leader.totalExperienceMonths,
                    },
                    ...item.team.members.map((item) => {
                        const { licenses, account, ...rest } = item.member;
                        return {
                            ...rest,
                            rank: HeadhuntingAdminGetDetailRecommendationRank.MEMBER,
                            username: account.username,
                            occupations: licenses.map((item) => item.code.name),
                        };
                    }),
                ],
                matchingStatus: item.settlement ? HeadhuntingMatchingStatus.MATCHING : HeadhuntingMatchingStatus.NOT_MATCHING,
                matchingDate: item.settlement?.createdAt || null,
            };
        });
        if (!headhunting) throw new NotFoundException('Headhunting not found');
        return {
            requestId: headhunting.requests[0].id,
            id: headhunting.id,
            paymentStatus: headhunting.paymentStatus,
            paymentDate: headhunting.paymentDate,
            companyName: headhunting.post.company.name,
            siteName: headhunting.post.site?.name || null,
            postName: headhunting.post.name,
            presentativeName: headhunting.post.company.name,
            email: headhunting.post.company.email,
            detail: headhunting.requests[0].detail,
            object: headhunting.requests[0].object,
            phone: headhunting.post.company.phone,
            occupation: headhunting.post.code.name,
            careerType: headhunting.post.experienceType,
            paymentAmount: headhunting.recommendations.reduce((accum, current) => {
                return accum + current.headhuntingRequest.usageHistory.productPaymentHistory.cost * 0.1;
            }, 0),
            members,
            teams,
        };
    }

    async createRecommendation(id: number, body: HeadhuntingAdminCreateRecommendationRequest): Promise<void> {
        const headhunting = await this.prismaService.headhunting.findUnique({
            where: {
                id,
                isActive: true,
            },
            select: {
                requests: {
                    take: 1,
                    orderBy: {
                        updatedAt: 'desc',
                    },
                    where: {
                        status: HeadhuntingRequestStatus.APPROVED,
                    },
                },
                recommendations: {
                    where: {
                        OR: [
                            {
                                teamId: body.id,
                            },
                            {
                                memberId: body.id,
                            },
                        ],
                    },
                },
            },
        });
        if (!headhunting) throw new NotFoundException('Headhunting not found');
        if (headhunting.requests.length === 0) throw new BadRequestException('Approve request not found');
        if (headhunting.requests[0].object === RequestObject.TEAM) {
            const team = await this.prismaService.team.findUnique({
                where: {
                    id: body.id,
                    isActive: true,
                },
            });
            if (!team) throw new NotFoundException('Team not found');
            if (
                headhunting.recommendations
                    .filter((item) => item.teamId)
                    .map((item) => item.teamId)
                    .includes(body.id)
            )
                throw new BadRequestException('Team has been recommended');
        }
        if (headhunting.requests[0].object === RequestObject.INDIVIDUAL) {
            const member = await this.prismaService.member.findUnique({
                where: {
                    id: body.id,
                    isActive: true,
                },
            });
            if (!member) throw new NotFoundException('Member not found');
            if (
                headhunting.recommendations
                    .filter((item) => item.memberId)
                    .map((item) => item.memberId)
                    .includes(body.id)
            )
                throw new BadRequestException('Member has been recommended');
        }
        await this.prismaService.headhunting.update({
            where: {
                id,
            },
            data: {
                recommendations: {
                    create: {
                        teamId: headhunting.requests[0].object === RequestObject.TEAM ? body.id : null,
                        memberId: headhunting.requests[0].object === RequestObject.INDIVIDUAL ? body.id : null,
                        headhuntingRequestId: headhunting.requests[0].id,
                    },
                },
            },
        });
    }

    async updatePayment(id: number, body: HeadhuntingAdminUpdatePaymentRequest): Promise<void> {
        const headhunting = await this.prismaService.headhunting.findUnique({
            where: {
                id,
                isActive: true,
            },
        });
        if (!headhunting) throw new NotFoundException('Headhunting not found');
        await this.prismaService.headhunting.update({
            where: {
                id,
            },
            data: {
                paymentStatus: body.paymentStatus,
                paymentDate: new Date(body.paymentDate),
            },
        });
    }

    async getDetailRequest(id: number): Promise<HeadhuntingAdminGetDetailRequestResponse> {
        const request = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id,
                isActive: true,
            },
            select: {
                id: true,
                headhunting: {
                    select: {
                        id: true,
                        post: {
                            select: {
                                experienceType: true,
                                code: {
                                    select: {
                                        name: true,
                                    },
                                },
                                name: true,
                                company: {
                                    select: {
                                        name: true,
                                        phone: true,
                                        presentativeName: true,
                                        email: true,
                                    },
                                },
                                site: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },

                object: true,
                detail: true,
                status: true,
            },
        });
        if (!request) throw new NotFoundException('Headhunting request not found');
        return {
            id: request.id,
            companyName: request.headhunting.post.company.name,
            siteName: request.headhunting.post.site?.name || null,
            postName: request.headhunting.post.name,
            presentativeName: request.headhunting.post.company.name,
            email: request.headhunting.post.company.email,
            detail: request.detail,
            object: request.object,
            phone: request.headhunting.post.company.phone,
            occupation: request.headhunting.post.code ? request.headhunting.post.code.name : null,
            careerType: request.headhunting.post.experienceType,
            status: request.status,
            headhuntingId: request.headhunting.id,
        };
    }

    async updateRequestStatus(id: number, body: HeadhuntingAdminUpdateRequestStatusRequest): Promise<void> {
        const request = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id,
                isActive: true,
            },
        });
        if (!request) throw new NotFoundException('Headhunting request not found');
        if (request.status !== HeadhuntingRequestStatus.APPLY && request.status !== HeadhuntingRequestStatus.RE_APPLY)
            throw new BadRequestException('status not correct');
        if (body.status !== HeadhuntingRequestStatus.REJECTED && body.status !== HeadhuntingRequestStatus.APPROVED)
            throw new BadRequestException('status request not correct');
        await this.prismaService.headhuntingRequest.update({
            where: {
                id,
            },
            data: {
                status: body.status,
                rejectReason: body.status === HeadhuntingRequestStatus.REJECTED ? body.reason : null,
            },
        });
    }
}
