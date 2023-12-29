import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { PostMemberService } from 'domain/post/member/post-member.service';
import { MemberTeamService } from 'domain/team/member/team-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { MatchingMemberGetListCategory } from './dto/matching-member-get-list-category.enum';
import { MatchingMemberGetListRequest } from './request/matching-member-get-list.request';
import { MatchingMemberTeamApplyRequest } from './request/matching-member-team-apply.request';
import { MatchingMemberGetDetailResponse } from './response/matching-member-get-detail.response';
import { MatchingMemberGetItemResponse, MatchingMemberGetListResponse } from './response/matching-member-get-list.response';
import { MatchingMemberInterestPostResponse } from './response/matching-member-interest-post.response';

@Injectable()
export class MatchingMemberService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly postMemberService: PostMemberService,
        private readonly memberTeamService: MemberTeamService,
    ) {}

    async getList(accountId: number, query: MatchingMemberGetListRequest): Promise<MatchingMemberGetListResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: {
                    select: {
                        id: true,
                        leader: true,
                        career: true,
                    },
                },
            },
        });

        this.checkCareer(account);

        const matchingPostToday = await this.prismaService.memberMatching.findFirst({
            where: {
                assignedAt: new Date(),
            },
        });

        if (!matchingPostToday) {
            //TODO: Using Algorithm to get 3 posts
            //Fake 3 nearest posts
            await this.addingNewMatchingPosts(account.member.id);
        }

        const queryFilter: Prisma.MemberMatchingWhereInput = {
            ...(query.category === MatchingMemberGetListCategory.APPLICATION && {
                post: {
                    applicants: {
                        some: {
                            OR: [{ memberId: account.member.id }, { teamId: { in: account.member.leader.map((acc) => acc.id) } }],
                        },
                    },
                },
            }),
            ...(query.category === MatchingMemberGetListCategory.REJECTION && {
                isRefuse: true,
            }),
            ...(query.category === MatchingMemberGetListCategory.DEADLINE && {
                post: {
                    endDate: { lt: new Date() },
                },
            }),
        };

        const lists = await this.prismaService.memberMatching.findMany({
            select: {
                id: true,
                isRefuse: true,
                post: {
                    select: {
                        id: true,
                        name: true,
                        workLocation: true,
                        startDate: true,
                        endDate: true,
                        company: {
                            select: {
                                logo: {
                                    select: {
                                        file: true,
                                    },
                                },
                            },
                        },
                        occupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        site: {
                            select: {
                                name: true,
                            },
                        },
                        interested: {
                            select: {
                                member: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                        applicants: {
                            select: {
                                member: {
                                    select: {
                                        id: true,
                                    },
                                },
                                team: {
                                    select: {
                                        leaderId: true,
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

        const listsCount = await this.prismaService.memberMatching.count({
            // Conditions based on request query
            where: queryFilter,
        });

        const responseLists: MatchingMemberGetItemResponse[] = this.mapToResponseDTO(lists, account);

        return new PaginationResponse(responseLists, new PageInfo(listsCount));
    }

    async addingNewMatchingPosts(memberId: number) {
        const matchingPosts = await this.prismaService.post.findMany({
            select: {
                id: true,
            },
            take: 3,
        });

        //Add to matching history
        await this.prismaService.memberMatching.createMany({
            data: [
                ...matchingPosts.map((matchingPost) => {
                    return { postId: matchingPost.id, memberId };
                }),
            ],
        });
    }

    mapToResponseDTO(lists, account): MatchingMemberGetItemResponse[] {
        return lists.map((item) => {
            return {
                id: item.id,
                postName: item.post.name,
                sitename: item.post.site?.name || null,
                location: item.post.workLocation,
                occupation: item.post.occupation?.codeName || null,
                deadline: item.post.endDate < new Date() ? 'deadline' : item.post.endDate,
                isRefuse: item.isRefuse,
                logo: item.post.company.logo?.file,
                isApplication: item.post.applicants.some((applicant) => {
                    return applicant.member?.id === account.member.id || applicant.team?.leaderId === account.member.id;
                }),
                isInterested: item.post.interested.map((item) => item.member.id).includes(account.member.id),
            } as MatchingMemberGetItemResponse;
        });
    }

    async detailPost(accountId: number, id: number): Promise<MatchingMemberGetDetailResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        const matchingPost = await this.prismaService.memberMatching.findUnique({
            where: {
                id,
            },
            include: {
                post: {
                    include: {
                        site: true,
                        occupation: true,
                        interested: {
                            include: {
                                member: true,
                            },
                        },
                    },
                },
            },
        });

        if (!matchingPost) {
            throw new NotFoundException('Post not found');
        }

        const detailPost: MatchingMemberGetDetailResponse = {
            postId: matchingPost.post.id,
            postName: matchingPost.post.name,
            startDate: matchingPost.post.startDate.toISOString(),
            endDate: matchingPost.post.endDate.toISOString(),
            numberOfRecruited: matchingPost.post.numberOfPeople,
            personInChargeName: matchingPost.post.site?.personInCharge || null,
            personInChargeContact: matchingPost.post.site?.personInChargeContact || null,
            career: matchingPost.post.experienceType,
            occupation: matchingPost.post.occupation?.codeName || null,
            preferentialTreatment: null, //??
            detail: matchingPost.post.otherInformation,
            siteName: matchingPost.post.site?.name || null,
            siteAddress: matchingPost.post.site?.address || null,
            siteStartDate: matchingPost.post.site?.startDate.toISOString() || null,
            siteEndDate: matchingPost.post.site?.endDate.toISOString() || null,
            originalBuilding: matchingPost.post.site?.originalBuilding || null,
            originalContractor: null, //??
            workLocation: matchingPost.post.workLocation,
            isInterested: matchingPost.post.interested.map((item) => item.member.id).includes(account.member.id),
        };

        return detailPost;
    }

    async refusePost(accountId: number, id: number): Promise<void> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        await this.prismaService.memberMatching.update({
            where: {
                id,
                memberId: account.member.id,
            },
            data: {
                isRefuse: true,
            },
        });
    }

    async individualApplyPost(accountId: number, id: number): Promise<void> {
        const matchingPost = await this.prismaService.memberMatching.findUnique({
            where: {
                id,
            },
        });

        if (!matchingPost) throw new NotFoundException('No matching post found');

        await this.postMemberService.addApplyPost(accountId, matchingPost.postId);
    }
    async teamApplyPost(accountId: number, id: number, body: MatchingMemberTeamApplyRequest): Promise<void> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        const matchingPost = await this.prismaService.memberMatching.findUnique({
            where: {
                id,
            },
        });

        if (!matchingPost) throw new NotFoundException('No matching post found');

        const team = await this.prismaService.team.findUnique({
            where: {
                id: body.teamId,
            },
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        if (team.leaderId !== account.member.id) throw new BadRequestException('You are not allow to do this');

        const payload = {
            teamId: body.teamId,
            postId: matchingPost.postId,
        };
        await this.memberTeamService.addApplyPost(accountId, payload);
    }

    async interestPost(accountId: number, id: number): Promise<MatchingMemberInterestPostResponse> {
        const matchingPost = await this.prismaService.memberMatching.findUnique({
            where: {
                id,
            },
        });

        if (!matchingPost) throw new NotFoundException('No matching post found');

        return await this.postMemberService.updateInterestPost(accountId, matchingPost.postId);
    }

    checkCareer(account) {
        //Checking member have create career
        if (!account.member.career.length) throw new BadRequestException('You need to create a career first');
    }
}
