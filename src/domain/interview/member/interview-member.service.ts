import { Injectable, NotFoundException } from '@nestjs/common';
import { PostApplicationStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { InterviewMemberGetListStatus } from './enum/interview-member-get-list-status.enum';
import { InterviewMemberGetListRequest } from './request/interview-member-get-list.request';
import { InterviewMemberGetListResponse } from './response/interview-member-get-list.response';

@Injectable()
export class InterviewMemberService {
    constructor(private prismaService: PrismaService) {}
    async getList(accountId: number, query: InterviewMemberGetListRequest): Promise<InterviewMemberGetListResponse> {
        const teams = await this.prismaService.member.findUnique({
            where: {
                accountId,
            },
            select: {
                teams: {
                    where: {
                        isActive: true,
                    },
                    select: {
                        teamId: true,
                    },
                },
                leaders: {
                    where: {
                        isActive: true,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });
        const teamIds = [...teams.teams.map((item) => item.teamId), ...teams.leaders.map((item) => item.id)];
        const queryFilter: Prisma.ApplicationWhereInput = {
            OR: [
                {
                    member: {
                        accountId,
                    },
                },
                {
                    team: {
                        id: {
                            in: teamIds,
                        },
                    },
                },
            ],
            assignedAt: {
                gte: query.startDate && new Date(query.startDate),
                lte: query.endDate && new Date(query.endDate),
            },
            NOT: {
                interview: null,
            },
            ...(query.status === InterviewMemberGetListStatus.INTERVIEW_COMPLETED && {
                status: {
                    in: [PostApplicationStatus.APPROVE_BY_COMPANY, PostApplicationStatus.REJECT_BY_COMPANY],
                },
            }),
            ...(query.status === InterviewMemberGetListStatus.PASS && {
                status: PostApplicationStatus.APPROVE_BY_COMPANY,
            }),
            ...(query.status === InterviewMemberGetListStatus.FAIL && {
                status: PostApplicationStatus.REJECT_BY_COMPANY,
            }),
            ...(query.status === InterviewMemberGetListStatus.DEADLINE && {
                post: {
                    isActive: true,
                    endDate: {
                        gt: new Date(),
                    },
                },
            }),
            ...(query.status === InterviewMemberGetListStatus.INTERVIEW_PROPOSAL && {
                status: PostApplicationStatus.PROPOSAL_INTERVIEW,
            }),
            ...(!query.status && {
                status: {
                    in: [
                        PostApplicationStatus.PROPOSAL_INTERVIEW,
                        PostApplicationStatus.APPROVE_BY_COMPANY,
                        PostApplicationStatus.REJECT_BY_COMPANY,
                    ],
                },
            }),
        };
        const application = (
            await this.prismaService.application.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    status: true,
                    assignedAt: true,
                    post: {
                        select: {
                            interests: {
                                where: {
                                    member: {
                                        accountId,
                                    },
                                },
                            },
                            id: true,
                            name: true,
                            endDate: true,
                            status: true,
                            code: true,
                            site: {
                                select: {
                                    name: true,
                                    contact: true,
                                    address: true,
                                    personInCharge: true,
                                    originalBuilding: true,
                                },
                            },
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                    logo: true,
                                },
                            },
                        },
                    },
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                applicationId: item.id,
                companyLogo: {
                    fileName: item.post.company.logo.fileName,
                    type: item.post.company.logo.type,
                    key: item.post.company.logo.key,
                    size: Number(item.post.company.logo.size),
                },
                postId: item.post.id,
                postName: item.post.name,
                postStatus: item.post.status,
                occupationId: item.post.code ? item.post.code.id : null,
                occupationName: item.post.code ? item.post.code.name : null,
                endDate: item.post.endDate,
                status: item.status,
                appliedDate: item.assignedAt,
                siteName: item.post.site ? item.post.site.name : '',
                siteAddress: item.post.site ? item.post.site.address : '',
                isInterested: item.post.interests.length === 0 ? false : true,
            };
        });
        const total = await this.prismaService.application.count({ where: queryFilter });
        return new PaginationResponse(application, new PageInfo(total));
    }

    async getTotal(accountId: number): Promise<number> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                accountId,
            },
        });
        if (!memberExist) throw new NotFoundException(Error.MEMBER_NOT_FOUND);

        return await this.prismaService.interview.count({
            where: {
                isActive: true,
                application: {
                    member: {
                        accountId,
                    },
                },
            },
        });
    }
}
