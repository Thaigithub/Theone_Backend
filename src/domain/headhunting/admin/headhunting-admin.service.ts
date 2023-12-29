import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, RequestObject, RequestStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { HeadhuntingAdminGetDetailApprovalRank } from './dto/headhunting-admin-get-detail-approval-rank.enum';
import {
    HeadhuntingAdminGetListApprovalCategory,
    HeadhuntingAdminGetListMemberApprovalCategory,
    HeadhuntingAdminGetListTeamApprovalCategory,
} from './dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntingAdminGetListApprovalMatching } from './dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from './dto/headhunting-admin-get-list-approval-payment.enum';
import { HeadhuntingAdminGetListCategory } from './dto/headhunting-admin-get-list-category.enum';
import { HeadhuntinAdminGetListRecommendationSort } from './dto/headhunting-admin-get-list-recommendation-sort.enum';
import {
    HeadhuntingAdminAddMemberRecommendationRequest,
    HeadhuntingAdminAddTeamRecommendationRequest,
} from './request/headhunting-admin-add-recommendation.request';
import { HeadhuntingAdminDenyRequestRequest } from './request/headhunting-admin-deny-request.request';
import { HeadhuntingAdminGetListApprovalRequest } from './request/headhunting-admin-get-list-approval.request';
import {
    HeadhuntingAdminGetListMemberRecommendationRequest,
    HeadhuntingAdminGetListTeamRecommendationRequest,
} from './request/headhunting-admin-get-list-recommendation.request';
import { HeadhuntingAdminGetListRequestRequest } from './request/headhunting-admin-get-list-request.request';
import {
    HeadhuntingGetDetailApprovalIndividualResponse,
    HeadhuntingGetDetailApprovalMemberResponse,
} from './response/headhunting-admin-get-detail-approval.response';
import { HeadhuntingAdminGetDetailRequestResponse } from './response/headhunting-admin-get-detail-request.response';
import { HeadhuntingGetDetailApprovalTeamResponse } from './response/headhunting-admin-get-detail-team-approval.response';
import {
    HeadhuntingAdminGetItemApprovalResponse,
    HeadhuntingAdminGetListApprovalResponse,
} from './response/headhunting-admin-get-list-approval.response';
import { HeadhuntingAdminGetListRecommendationResponse } from './response/headhunting-admin-get-list-recommendation.response';
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
            status: { in: [RequestStatus.APPLY, RequestStatus.RE_APPLY] },
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
                object: true,
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
                        specialOccupation: {
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
            specialNote: headhuntingDetail.post.specialOccupation?.codeName || null,
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
                headhuntingRecommendation: true,
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

        const headhuntingRequest = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id: query.requestId,
                isActive: true,
            },
        });

        const responseList = list.map((item) => {
            const response: HeadhuntingAdminGetListRecommendationResponse = {
                ...item,
                isSuggest: item.headhuntingRecommendation
                    .map((recommend) => recommend.postId)
                    .includes(headhuntingRequest.postId),
            };
            return response;
        });

        return new PaginationResponse(responseList, new PageInfo(listCount));
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
                headhuntingRequestId: body.requestId,
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
                headhuntingRecommendation: true,
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

        const headhuntingRequest = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id: query.requestId,
                isActive: true,
            },
        });

        const responseList = list.map((item) => {
            console.log(headhuntingRequest.postId);

            const response: HeadhuntingAdminGetListRecommendationResponse = {
                ...item,
                isSuggest: item.headhuntingRecommendation
                    .map((recommend) => recommend.postId)
                    .includes(headhuntingRequest.postId),
            };
            return response;
        });

        return new PaginationResponse(responseList, new PageInfo(listCount));
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
                headhuntingRequestId: body.requestId,
            },
        });
    }

    async getListApproved(query: HeadhuntingAdminGetListApprovalRequest): Promise<HeadhuntingAdminGetListApprovalResponse> {
        const queryFilter: Prisma.HeadhuntingRecommendationWhereInput = {
            ...(query.startRecommendationDate && { assignedAt: { gte: new Date(query.startRecommendationDate) } }),
            ...(query.endRecommendationDate && { assignedAt: { lte: new Date(query.endRecommendationDate) } }),
            ...(query.startMatchingDate && { assignedAt: { gte: new Date(query.startMatchingDate) } }),
            ...(query.endMatchingDate && { assignedAt: { gte: new Date(query.endMatchingDate) } }),
            //TODO: All approval, dont need requestStatus, matchingStatus
            ...(query.paymentStatus && {}), //TODO: Adjust in future
            ...(query.startPaymentDate && {}), //TODO: Adjust in future
            ...(query.endPaymentDate && {}), //TODO: Adjust in future
            ...(query.category === HeadhuntingAdminGetListApprovalCategory.POST_NAME && {
                post: { name: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === HeadhuntingAdminGetListApprovalCategory.SITE_NAME && {
                post: { site: { name: { contains: query.keyword, mode: 'insensitive' } } },
            }),
            ...(query.category === HeadhuntingAdminGetListApprovalCategory.WORK_NAME && {
                OR: [
                    { member: { name: { contains: query.keyword, mode: 'insensitive' } } },
                    { team: { name: { contains: query.keyword, mode: 'insensitive' } } },
                ],
            }),
        };

        const list = await this.prismaService.headhuntingRecommendation.findMany({
            select: {
                id: true,
                assignedAt: true,
                member: true,
                team: {
                    select: {
                        name: true,
                        leader: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        name: true,
                        headhuntingRequest: true,
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
            orderBy: {},
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.headhuntingRecommendation.count({
            // Conditions based on request query
            where: queryFilter,
        });

        const responseList: HeadhuntingAdminGetItemApprovalResponse[] = list.map((item) => {
            return {
                id: item.id,
                object: !item.member ? RequestObject.TEAM : RequestObject.INDIVIDUAL,
                postName: item.post?.name,
                siteName: item.post.site?.name || null,
                recommendationDate: item.assignedAt,
                workername: !item.member ? item.team.name : item.member.name,
                tier: item.member?.level || null,
                requestStatus: RequestStatus.APPROVED,
                matchingStatus: HeadhuntingAdminGetListApprovalMatching.SUCCESSFUL,
                matchingDay: item.assignedAt,
                paymentStatus: HeadhuntingAdminGetListApprovalPayment.UNPAID, //TODO: Adjust in future
                paymentDate: new Date(), //TODO: Adjust in future
            } as HeadhuntingAdminGetItemApprovalResponse;
        });

        return new PaginationResponse(responseList, new PageInfo(listCount));
    }

    async getDetailIndividual(id: number): Promise<HeadhuntingGetDetailApprovalIndividualResponse> {
        const detail = await this.prismaService.headhuntingRecommendation.findUnique({
            where: {
                id,
            },
            include: {
                headhuntingRequest: true,
                member: {
                    include: {
                        account: true,
                        desiredOccupation: true,
                        specialLicenses: {
                            include: {
                                code: true,
                            },
                        },
                        certificates: true,
                    },
                },
                post: {
                    include: {
                        site: true,
                        specialOccupation: true,
                        occupation: true,
                    },
                },
            },
        });

        const detailResponse: HeadhuntingGetDetailApprovalIndividualResponse = {
            general: {
                id: detail.id,
                siteName: detail.post.site?.name || null,
                siteContact: detail.post.site?.contact || null,
                personInCharge: detail.post.site?.personInCharge || null,
                specialOccupation: detail.post.specialOccupation?.codeName || null,
                occupation: detail.post.occupation?.codeName || null,
                object: detail.headhuntingRequest.object,
                career: detail.post.experienceType,
                title: detail.post.name,
                detail: detail.headhuntingRequest.detail,
                paymentStatus: HeadhuntingAdminGetListApprovalPayment.UNPAID, //TODO: Adjust in future
                paymentAmount: 0, //TODO: Adjust in future
                paymentDate: new Date().toISOString(), //TODO: Adjust in future
                matchingStatus: HeadhuntingAdminGetListApprovalMatching.SUCCESSFUL,
                matchingDay: new Date().toISOString(),
            },
            member: {
                rank: HeadhuntingAdminGetDetailApprovalRank.MEMBER,
                name: detail.member.name,
                contact: detail.member.contact,
                username: detail.member.account.username,
                occupation: detail.member.desiredOccupation?.codeName || null,
                address: detail.member.address,
                certificate: detail.member.certificates.map((cer) => cer.name),
                specialOccupation: detail.member.specialLicenses.map((special) => special.code.codeName),
                experienceMonths: detail.member.totalExperienceMonths,
                experienceYears: detail.member.totalExperienceYears,
            },
        };

        return detailResponse;
    }

    async getDetailTeam(id: number): Promise<HeadhuntingGetDetailApprovalTeamResponse> {
        const detail = await this.prismaService.headhuntingRecommendation.findUnique({
            where: {
                id,
            },
            include: {
                headhuntingRequest: true,
                team: {
                    include: {
                        members: {
                            include: {
                                member: {
                                    include: {
                                        account: true,
                                        desiredOccupation: true,
                                        specialLicenses: {
                                            include: {
                                                code: true,
                                            },
                                        },
                                        certificates: true,
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    include: {
                        site: true,
                        specialOccupation: true,
                        occupation: true,
                    },
                },
            },
        });

        const detailResponse: HeadhuntingGetDetailApprovalTeamResponse = {
            general: {
                id: detail.id,
                siteName: detail.post.site?.name || null,
                siteContact: detail.post.site?.contact || null,
                personInCharge: detail.post.site?.personInCharge || null,
                specialOccupation: detail.post.specialOccupation?.codeName || null,
                occupation: detail.post.occupation?.codeName || null,
                object: detail.headhuntingRequest.object,
                career: detail.post.experienceType,
                title: detail.post.name,
                detail: detail.headhuntingRequest.detail,
                paymentStatus: HeadhuntingAdminGetListApprovalPayment.UNPAID, //TODO: Adjust in future
                paymentAmount: 0, //TODO: Adjust in future
                paymentDate: new Date().toISOString(), //TODO: Adjust in future
                matchingStatus: HeadhuntingAdminGetListApprovalMatching.SUCCESSFUL,
                matchingDay: new Date().toISOString(),
            },
            teamName: detail.team.name,
            numberOfMembers: detail.team.totalMembers,
            members: detail.team.members.map((memberTeam) => {
                const member = memberTeam.member;
                return {
                    rank:
                        member.id === detail.team.leaderId
                            ? HeadhuntingAdminGetDetailApprovalRank.LEADER
                            : HeadhuntingAdminGetDetailApprovalRank.MEMBER,
                    name: member.name,
                    contact: member.contact,
                    username: member.account.username,
                    occupation: member.desiredOccupation?.codeName,
                    address: member.address,
                    certificate: member.certificates.map((cer) => cer.name),
                    specialOccupation: member.specialLicenses.map((special) => special.code.codeName),
                    experienceMonths: member.totalExperienceMonths,
                    experienceYears: member.totalExperienceYears,
                } as HeadhuntingGetDetailApprovalMemberResponse;
            }),
        };

        return detailResponse;
    }
}
