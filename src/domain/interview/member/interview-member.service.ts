import { Injectable } from '@nestjs/common';
import { PostApplicationStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { InterviewMemberGetListRequest, InterviewStatus } from './request/interview-member-get-list.request';
import { InterviewMemberGetListResponse } from './response/interview-member-get-list.response';

@Injectable()
export class InterviewMemberService {
    constructor(private prismaService: PrismaService) {}
    async getList(accountId: number, query: InterviewMemberGetListRequest): Promise<InterviewMemberGetListResponse> {
        const teams = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId,
                },
                select: {
                    teams: {
                        select: {
                            teamId: true,
                        },
                    },
                },
            })
        ).teams.map((item) => item.teamId);
        const search = {
            ...QueryPagingHelper.queryPaging(query),
            where: {
                OR: [
                    {
                        member: {
                            accountId,
                        },
                        assignedAt: {
                            gte: query.startDate && new Date(query.startDate),
                            lte: query.endDate && new Date(query.endDate),
                        },
                    },
                    {
                        team: {
                            id: {
                                in: teams,
                            },
                        },
                        assignedAt: {
                            gte: query.startDate && new Date(query.startDate),
                            lte: query.endDate && new Date(query.endDate),
                        },
                    },
                ],
                NOT: {
                    interview: null,
                },
            },
            select: {
                id: true,
                status: true,
                assignedAt: true,
                post: {
                    select: {
                        interested: {
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
                        occupation: {
                            select: {
                                codeName: true,
                                id: true,
                            },
                        },

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
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                fileName: true,
                                                key: true,
                                                type: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
        switch (query.status) {
            case InterviewStatus.INTERVIEW_COMPLETED: {
                search.where.OR = search.where.OR.map((item) => {
                    return {
                        ...item,
                        status: {
                            in: [PostApplicationStatus.APPROVE_BY_COMPANY, PostApplicationStatus.REJECT_BY_COMPANY],
                        },
                    };
                });
                break;
            }
            case InterviewStatus.PASS: {
                search.where.OR = search.where.OR.map((item) => {
                    return {
                        ...item,
                        status: PostApplicationStatus.APPROVE_BY_COMPANY,
                    };
                });
                break;
            }
            case InterviewStatus.FAIL: {
                search.where.OR = search.where.OR.map((item) => {
                    return {
                        ...item,
                        status: PostApplicationStatus.REJECT_BY_COMPANY,
                    };
                });
                break;
            }
            case InterviewStatus.DEADLINE: {
                search.where.OR = search.where.OR.map((item) => {
                    return {
                        ...item,
                        post: {
                            endDate: {
                                gt: new Date(),
                            },
                        },
                    };
                });
                break;
            }
            case InterviewStatus.INTERVIEW_PROPOSAL: {
                search.where.OR = search.where.OR.map((item) => {
                    return {
                        ...item,
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                    };
                });
                break;
            }
            default: {
                search.where.OR = search.where.OR.map((item) => {
                    return {
                        ...item,
                        status: {
                            in: [
                                PostApplicationStatus.PROPOSAL_INTERVIEW,
                                PostApplicationStatus.APPROVE_BY_COMPANY,
                                PostApplicationStatus.REJECT_BY_COMPANY,
                            ],
                        },
                    };
                });
                break;
            }
        }
        const application = (await this.prismaService.application.findMany(search)).map((item) => {
            return {
                applicationId: item.id,
                companyLogo: item.post.company.logo.file,
                postId: item.post.id,
                postName: item.post.name,
                postStatus: item.post.status,
                occupationId: item.post.occupation ? item.post.occupation.id : null,
                occupationName: item.post.occupation ? item.post.occupation.codeName : null,
                endDate: item.post.endDate,
                status: item.status,
                appliedDate: item.assignedAt,
                siteName: item.post.site ? item.post.site.name : '',
                siteAddress: item.post.site ? item.post.site.address : '',
                isInterested: item.post.interested.length === 0 ? false : true,
            };
        });
        const total = await this.prismaService.application.count({ where: search.where });
        return new PaginationResponse(application, new PageInfo(total));
    }
}
