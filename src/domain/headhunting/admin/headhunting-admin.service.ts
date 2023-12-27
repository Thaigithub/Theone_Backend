import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, RequestObject, RequestStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import {
    HeadhuntingAdminGetListMemberApprovalCategory,
    HeadhuntingAdminGetListTeamApprovalCategory,
} from './dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntingAdminGetListCategory } from './dto/headhunting-admin-get-list-category.enum';
import { HeadhuntinAdminGetListRecommendationSort } from './dto/headhunting-admin-get-list-recommendation-sort.enum';
import {
    HeadhuntingAdminAddMemberRecommendationRequest,
    HeadhuntingAdminAddTeamRecommendationRequest,
} from './request/headhunting-admin-add-recommendation.request';
import { HeadhuntingAdminDenyRequestRequest } from './request/headhunting-admin-deny-request.request';
import {
    HeadhuntingAdminGetListMemberRecommendationRequest,
    HeadhuntingAdminGetListTeamRecommendationRequest,
} from './request/headhunting-admin-get-list-recommendation.request';
import { HeadhuntingAdminGetListRequestRequest } from './request/headhunting-admin-get-list-request.request';
import { HeadhuntingAdminGetDetailRequestResponse } from './response/headhunting-admin-get-detail-request.response';
import { HeadhuntingAdminGetListRecommendationResponse } from './response/headhunting-admin-get-list-approval.response';
import {
    HeadhuntingAdminGetItemRequestResponse,
    HeadhuntingAdminGetListRequestResponse,
} from './response/headhunting-admin-get-list-request.response';

@Injectable()
export class HeadhuntingAdminService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(query: HeadhuntingAdminGetListRequestRequest): Promise<HeadhuntingAdminGetListRequestResponse> {
        const queryFilter: Prisma.HeadhuntingRequestWhereInput = {
            isActive: true,
            ...(query.startRequestDate && { date: { gte: new Date(query.startRequestDate) } }),
            ...(query.endRequestDate && { date: { lte: new Date(query.endRequestDate) } }),
            ...(query.status && { status: RequestStatus[query.status] }),
            ...(query.category === HeadhuntingAdminGetListCategory.ANOUNCEMENT_NAME && {
                post: { name: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === HeadhuntingAdminGetListCategory.SITE_NAME && {
                post: { site: { name: { contains: query.keyword, mode: 'insensitive' } } },
            }),
        };

        const list = await this.prismaService.headhuntingRequest.findMany({
            select: {
                id: true,
                date: true,
                status: true,
                post: {
                    select: {
                        id: true,
                        name: true,
                        site: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        company: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.headhuntingRequest.count({
            // Conditions based on request query
            where: queryFilter,
        });

        const responseList = list.map((item) => {
            const { post, ...rest } = item;
            const res: HeadhuntingAdminGetItemRequestResponse = {
                ...rest,
                companyName: post.company.name,
                siteName: post.site?.name || null,
                postName: post.name,
            };

            return res;
        });

        return new PaginationResponse(responseList, new PageInfo(listCount));
    }

    async getRequestAccount(accountId: number) {
        return await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                admin: true,
            },
        });
    }

    async getDetail(id: number): Promise<HeadhuntingAdminGetDetailRequestResponse> {
        const headhuntingDetail = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id,
                isActive: true,
            },
            select: {
                id: true,
                object: true,
                detail: true,
                post: {
                    select: {
                        name: true,
                        site: {
                            select: {
                                name: true,
                                personInCharge: true,
                                contact: true,
                                email: true,
                            },
                        },
                        specialNote: {
                            select: {
                                codeName: true,
                            },
                        },
                        occupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        experienceType: true,
                    },
                },
            },
        });

        if (!headhuntingDetail) throw new BadRequestException('The One Headhunting Details not found');

        return {
            id: headhuntingDetail.id,
            siteName: headhuntingDetail.post.site?.name || null,
            personInChargeName: headhuntingDetail.post.site?.personInCharge || null,
            siteContact: headhuntingDetail.post.site?.contact || null,
            siteEmail: headhuntingDetail.post.site?.email || null,
            occupation: headhuntingDetail.post.occupation?.codeName || null,
            specialNote: headhuntingDetail.post.specialNote?.codeName || null,
            career: headhuntingDetail.post.experienceType,
            employee: headhuntingDetail.object,
            title: headhuntingDetail.post.name,
            detail: headhuntingDetail.detail,
        } as HeadhuntingAdminGetDetailRequestResponse;
    }

    async approveRequest(id: number) {
        const headhuntingRequest = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id,
                isActive: true,
                status: {
                    in: [RequestStatus.RE_APPLY, RequestStatus.APPLY, RequestStatus.APPROVED],
                },
            },
        });

        if (!headhuntingRequest) throw new BadRequestException('The One Headhunting request has been processed.');

        await this.prismaService.headhuntingRequest.update({
            where: {
                id,
                isActive: true,
            },
            data: {
                status: RequestStatus.APPROVED,
            },
        });
    }

    async denyRequest(id: number, body: HeadhuntingAdminDenyRequestRequest) {
        const headhuntingRequest = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id,
                isActive: true,
                status: {
                    in: [RequestStatus.RE_APPLY, RequestStatus.APPLY],
                },
            },
        });

        if (!headhuntingRequest) throw new BadRequestException('The One Headhunting request has been processed.');

        await this.prismaService.headhuntingRequest.update({
            where: {
                id,
                isActive: true,
            },
            data: {
                status: RequestStatus.REJECTED,
                rejectReason: body.denyReason,
            },
        });
    }

    async getListMemberRecommendation(
        query: HeadhuntingAdminGetListMemberRecommendationRequest,
    ): Promise<HeadhuntingAdminGetListRecommendationResponse> {
        const queryFilter: Prisma.MemberWhereInput = {
            isActive: true,
            ...(query.tier && { level: query.tier }),
            ...(query.category === HeadhuntingAdminGetListMemberApprovalCategory.WORK_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === HeadhuntingAdminGetListMemberApprovalCategory.ID && {
                account: { username: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === HeadhuntingAdminGetListMemberApprovalCategory.CONTACT && {
                contact: { contains: query.keyword, mode: 'insensitive' },
            }),
            //TODO: Special
        };

        const list = await this.prismaService.member.findMany({
            select: {
                id: true,
                name: true,
                level: true,
                contact: true,
                desiredOccupation: true,
                specialLicenses: true,
                certificates: true,
                account: {
                    select: {
                        username: true,
                    },
                },
                memberEvaluation: {
                    select: {
                        averageScore: true,
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                ...(query.sortScore === HeadhuntinAdminGetListRecommendationSort.HIGHEST_SCORE && {
                    memberEvaluation: { averageScore: { sort: 'desc', nulls: 'last' } },
                }),
                ...(query.sortScore === HeadhuntinAdminGetListRecommendationSort.LOWEST_SCORE && {
                    memberEvaluation: { averageScore: { sort: 'asc', nulls: 'last' } },
                }),
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.member.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(listCount));
    }

    async addListMemberRecommendation(body: HeadhuntingAdminAddMemberRecommendationRequest) {
        const request = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id: body.requestId,
                object: RequestObject.INDIVIDUAL,
                isActive: true,
                status: RequestStatus.APPROVED,
            },
        });

        if (!request) throw new BadRequestException('Request is not correct');

        const member = await this.prismaService.member.findUnique({
            where: {
                id: body.memberId,
                isActive: true,
            },
        });

        if (!member) throw new BadRequestException('Member is not found');

        await this.prismaService.headhuntingRecommendation.create({
            data: {
                memberId: body.memberId,
                postId: request.postId,
            },
        });
    }

    async getListTeamRecommendation(query: HeadhuntingAdminGetListTeamRecommendationRequest) {
        const queryFilter: Prisma.TeamWhereInput = {
            isActive: true,
            ...(query.tier && { leader: { level: query.tier } }),
            ...(query.category === HeadhuntingAdminGetListTeamApprovalCategory.TEAM_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === HeadhuntingAdminGetListTeamApprovalCategory.TEAM_LEADER_NAME && {
                leader: { name: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === HeadhuntingAdminGetListTeamApprovalCategory.CONTACT && {
                leader: { contact: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === HeadhuntingAdminGetListTeamApprovalCategory.ID && {
                leader: { account: { username: { contains: query.keyword, mode: 'insensitive' } } },
            }),
            //TODO: Special, Qualification
        };

        const list = await this.prismaService.team.findMany({
            select: {
                id: true,
                name: true,
                leader: {
                    select: {
                        name: true,
                        contact: true,
                        desiredOccupation: true,
                        specialLicenses: true,
                        certificates: true,
                        level: true,
                        memberEvaluation: {
                            select: {
                                averageScore: true,
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
            where: queryFilter,
            orderBy: {
                ...(query.sortScore === HeadhuntinAdminGetListRecommendationSort.HIGHEST_SCORE && {
                    leader: {
                        memberEvaluation: { averageScore: { sort: 'desc', nulls: 'last' } },
                    },
                }),
                ...(query.sortScore === HeadhuntinAdminGetListRecommendationSort.LOWEST_SCORE && {
                    leader: {
                        memberEvaluation: { averageScore: { sort: 'asc', nulls: 'last' } },
                    },
                }),
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.team.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(listCount));
    }

    async addListTeamRecommendation(body: HeadhuntingAdminAddTeamRecommendationRequest) {
        const request = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id: body.requestId,
                object: RequestObject.TEAM,
                isActive: true,
                status: RequestStatus.APPROVED,
            },
        });

        if (!request) throw new BadRequestException('Post is not correct');

        const member = await this.prismaService.team.findUnique({
            where: {
                id: body.teamId,
                isActive: true,
            },
        });

        if (!member) throw new BadRequestException('Team is not found');

        await this.prismaService.headhuntingRecommendation.create({
            data: {
                teamId: body.teamId,
                postId: request.postId,
            },
        });
    }
}
