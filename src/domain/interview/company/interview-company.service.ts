import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
    ApplicationCategory,
    InterviewStatus,
    MemberLevel,
    NotificationType,
    PostApplicationStatus,
    PostCategory,
    Prisma,
    RequestObject,
} from '@prisma/client';
import { ApplicationCompanyService } from 'domain/application/company/application-company.service';
import { ApplicationCompanyGetDetailMemberResponse } from 'domain/application/company/response/application-company-get-detail-member.response';
import { ApplicationCompanyGetDetailTeamResponse } from 'domain/application/company/response/application-company-get-detail-team.response';
import { NotificationMemberService } from 'domain/notification/member/notification-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { InterviewCompanyType } from './enum/interview-company-type.enum';
import { InterviewCompanyProposeRequest } from './request/interview-company-create.request';
import { InterviewCompanyGetListRequest } from './request/interview-company-get-list.request';
import { InterviewCompanyGetListResponse } from './response/interview-company-get-list.response';

@Injectable()
export class InterviewCompanyService {
    constructor(
        private prismaService: PrismaService,
        private applicationCompanyService: ApplicationCompanyService,
        private notificationMemberService: NotificationMemberService,
    ) {}

    async getList(accountId: number, query: InterviewCompanyGetListRequest): Promise<InterviewCompanyGetListResponse> {
        const queryFilter: Prisma.InterviewWhereInput = {
            application: {
                post: {
                    company: {
                        accountId,
                        isActive: true,
                    },
                },
            },
            ...(query.object === RequestObject.INDIVIDUAL && {
                application: {
                    ...(query.category && { category: query.category }),
                    team: null,
                    post: {
                        company: {
                            accountId,
                        },
                    },
                },
            }),
            ...(query.object === RequestObject.TEAM && {
                application: {
                    ...(query.category && { category: query.category }),
                    member: null,
                    post: {
                        company: {
                            accountId,
                        },
                    },
                },
            }),
            ...(query.result && { status: query.result }),
            ...(query.startDate && {
                requestDate: { gte: new Date(query.startDate) },
            }),
            ...(query.endDate && {
                requestDate: { lte: new Date(query.endDate) },
            }),
            ...(query.keyword && {
                OR: [
                    { application: { post: { name: { contains: query.keyword, mode: 'insensitive' } } } },
                    { application: { member: { name: { contains: query.keyword, mode: 'insensitive' } } } },
                    { application: { team: { name: { contains: query.keyword, mode: 'insensitive' } } } },
                ],
            }),
        };

        const list = await this.prismaService.interview.findMany({
            select: {
                id: true,
                status: true,
                requestDate: true,
                application: {
                    select: {
                        category: true,
                        member: {
                            select: {
                                name: true,
                                contact: true,
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
                                name: true,
                                leader: {
                                    select: {
                                        contact: true,
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
                                            },
                                        },
                                        account: {
                                            select: {
                                                isActive: true,
                                            },
                                        },
                                    },
                                },
                                isActive: true,
                            },
                        },
                        post: {
                            select: {
                                name: true,
                                companyId: true,
                            },
                        },
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.interview.count({
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(listCount));
    }

    async getDetailMember(accountId: number, id: number): Promise<ApplicationCompanyGetDetailMemberResponse> {
        const interview = await this.prismaService.interview.findUnique({
            where: {
                id,
                application: {
                    post: {
                        company: {
                            accountId: accountId,
                            isActive: true,
                        },
                    },
                },
            },
        });

        if (!interview) throw new BadRequestException(Error.INTERVIEW_NOT_FOUND);

        return await this.applicationCompanyService.getDetailMember(accountId, interview.applicationId);
    }

    async getDetailTeam(accountId: number, id: number): Promise<ApplicationCompanyGetDetailTeamResponse> {
        const interview = await this.prismaService.interview.findUnique({
            where: {
                id,
                application: {
                    post: {
                        company: {
                            accountId: accountId,
                            isActive: true,
                        },
                    },
                },
            },
        });

        if (!interview) throw new BadRequestException(Error.INTERVIEW_NOT_FOUND);

        return await this.applicationCompanyService.getDetailTeam(accountId, interview.applicationId);
    }

    async updateStatus(accountId: number, id: number, result: InterviewStatus): Promise<void> {
        const interview = await this.prismaService.interview.findUnique({
            where: {
                id,
                application: {
                    post: {
                        company: {
                            accountId,
                            isActive: true,
                        },
                    },
                },
            },
        });
        if (!interview) throw new NotFoundException(Error.INTERVIEW_NOT_FOUND);
        const afterUpdateInterview = await this.prismaService.interview.update({
            where: {
                id,
            },
            data: {
                status: result,
                application: {
                    update: {
                        status:
                            result === InterviewStatus.PASS
                                ? PostApplicationStatus.APPROVE_BY_COMPANY
                                : PostApplicationStatus.REJECT_BY_COMPANY,
                    },
                },
            },
            select: {
                status: true,
                application: {
                    select: {
                        id: true,
                        member: {
                            select: {
                                accountId: true,
                            },
                        },
                        team: {
                            select: {
                                leader: {
                                    select: {
                                        accountId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (afterUpdateInterview.status === InterviewStatus.PASS) {
            if (afterUpdateInterview.application.member) {
                await this.notificationMemberService.create(
                    afterUpdateInterview.application.member.accountId,
                    '출근일정 확인',
                    '지원현장에 지정일에 출근해 주세요.',
                    NotificationType.APPLICATION,
                    afterUpdateInterview.application.id,
                );
            } else if (afterUpdateInterview.application.team) {
                await this.notificationMemberService.create(
                    afterUpdateInterview.application.team.leader.accountId,
                    '출근일정 확인',
                    '지원현장에 지정일에 출근해 주세요.',
                    NotificationType.APPLICATION,
                    afterUpdateInterview.application.id,
                );
            }
        } else if (afterUpdateInterview.status === InterviewStatus.FAIL) {
            if (afterUpdateInterview.application.member) {
                await this.notificationMemberService.create(
                    afterUpdateInterview.application.member.accountId,
                    '공고 지원결과',
                    '지원현장에 채용되지 않았습니다. 다른 현장에 지원해 보세요.',
                    NotificationType.INTERVIEW,
                    id,
                );
            } else if (afterUpdateInterview.application.team) {
                await this.notificationMemberService.create(
                    afterUpdateInterview.application.team.leader.accountId,
                    '공고 지원결과',
                    '지원현장에 채용되지 않았습니다. 다른 현장에 지원해 보세요.',
                    NotificationType.INTERVIEW,
                    id,
                );
            }
        }
    }

    async create(body: InterviewCompanyProposeRequest, accountId: number): Promise<void> {
        const postExist = await this.prismaService.post.findUnique({
            where: {
                isActive: true,
                id: body.postId,
                company: {
                    accountId,
                    isActive: true,
                },
            },
            select: {
                category: true,
            },
        });
        if (!postExist) throw new NotFoundException(Error.POST_NOT_FOUND);
        const interview = await this.prismaService.interview.count({
            where: {
                application: {
                    postId: body.postId,
                    memberId: body.interviewProposalType === InterviewCompanyType.MEMBER ? body.id : undefined,
                    teamId: body.interviewProposalType === InterviewCompanyType.TEAM ? body.id : undefined,
                    post: {
                        company: {
                            accountId: accountId,
                        },
                    },
                },
            },
        });
        if (interview !== 0) {
            throw new BadRequestException(Error.INTERVIEW_EXISTED);
        }
        await this.prismaService.$transaction(async (prisma) => {
            let application = null;
            switch (body.interviewProposalType) {
                case InterviewCompanyType.MEMBER: {
                    const member = await prisma.member.findUnique({
                        where: {
                            id: body.id,
                            isActive: true,
                        },
                        select: {
                            level: true,
                        },
                    });
                    if (!member) throw new NotFoundException(Error.MEMBER_NOT_FOUND);
                    const record = await prisma.application.findUnique({
                        where: {
                            memberId_postId: {
                                memberId: body.id,
                                postId: body.postId,
                            },
                            post: {
                                company: {
                                    accountId,
                                },
                            },
                        },
                        select: {
                            status: true,
                        },
                    });

                    if (record && record.status !== PostApplicationStatus.APPLY) {
                        throw new BadRequestException(Error.APPLICATION_STATUS_IS_NOT_APPROPRIATE);
                    }
                    switch (postExist.category) {
                        case PostCategory.HEADHUNTING: {
                            if (Array<MemberLevel>(MemberLevel.THIRD, MemberLevel.SECOND).includes(member.level))
                                throw new BadRequestException(Error.MEMBER_IS_NOT_CERTIFIED_LEVEL);
                            break;
                        }
                        case PostCategory.MATCHING: {
                            if (member.level !== MemberLevel.SECOND)
                                throw new BadRequestException(Error.MEMBER_IS_NOT_CERTIFIED_LEVEL);
                            break;
                        }
                    }
                    switch (body.category) {
                        case ApplicationCategory.HEADHUNTING: {
                            if (postExist.category !== ApplicationCategory.HEADHUNTING)
                                throw new BadRequestException(Error.POST_IS_NOT_AT_CORRECT_CATEGORY);
                            break;
                        }
                        case ApplicationCategory.MATCHING: {
                            if (postExist.category !== ApplicationCategory.MATCHING)
                                throw new BadRequestException(Error.POST_IS_NOT_AT_CORRECT_CATEGORY);
                            break;
                        }
                        default: {
                            if (
                                Array<MemberLevel>(MemberLevel.GOLD, MemberLevel.PLATINUM, MemberLevel.SILVER).includes(
                                    member.level,
                                ) &&
                                !record
                            ) {
                                throw new BadRequestException(Error.MEMBER_IS_NOT_CERTIFIED_LEVEL);
                            }
                            break;
                        }
                    }
                    const headhunting = await prisma.member.findUnique({
                        where: {
                            id: body.id,
                            headhuntingRecommendations: {
                                some: {
                                    headhunting: {
                                        postId: body.postId,
                                    },
                                },
                            },
                        },
                        select: {
                            headhuntingRecommendations: {
                                where: {
                                    headhunting: {
                                        postId: body.postId,
                                    },
                                },
                                take: 1,
                            },
                        },
                    });
                    application = await prisma.application.upsert({
                        create: {
                            memberId: body.id,
                            postId: body.postId,
                            status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                            interview: {
                                create: {
                                    status: InterviewStatus.INTERVIEWING,
                                },
                            },
                            category: body.category,
                            headhuntingRecommendation: headhunting
                                ? {
                                      connect: {
                                          id: headhunting.headhuntingRecommendations[0].id,
                                      },
                                  }
                                : undefined,
                        },
                        update: {
                            status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                            interview: {
                                create: {
                                    status: InterviewStatus.INTERVIEWING,
                                },
                            },
                            category: body.category,
                        },
                        where: {
                            memberId_postId: {
                                memberId: body.id,
                                postId: body.postId,
                            },
                            post: {
                                company: {
                                    accountId,
                                },
                            },
                            status: PostApplicationStatus.APPLY,
                        },
                        select: {
                            id: true,
                        },
                    });
                    break;
                }
                case InterviewCompanyType.TEAM: {
                    const team = await prisma.team.findUnique({
                        where: {
                            id: body.id,
                            isActive: true,
                        },
                        select: {
                            leader: {
                                select: {
                                    level: true,
                                },
                            },
                        },
                    });
                    if (!team) throw new NotFoundException(Error.TEAM_NOT_FOUND);
                    const record = await prisma.application.findUnique({
                        where: {
                            teamId_postId: {
                                teamId: body.id,
                                postId: body.postId,
                            },
                            post: {
                                company: {
                                    accountId,
                                },
                            },
                        },
                        select: {
                            status: true,
                        },
                    });

                    if (record && record.status !== PostApplicationStatus.APPLY) {
                        throw new BadRequestException(Error.APPLICATION_STATUS_IS_NOT_APPROPRIATE);
                    }
                    switch (postExist.category) {
                        case PostCategory.HEADHUNTING: {
                            if (Array<MemberLevel>(MemberLevel.THIRD, MemberLevel.SECOND).includes(team.leader.level))
                                throw new BadRequestException(Error.LEADER_IS_NOT_CERTIFIED_LEVEL);
                            break;
                        }
                        case PostCategory.MATCHING: {
                            if (team.leader.level !== MemberLevel.SECOND)
                                throw new BadRequestException(Error.LEADER_IS_NOT_CERTIFIED_LEVEL);
                            break;
                        }
                    }
                    switch (body.category) {
                        case ApplicationCategory.HEADHUNTING: {
                            if (postExist.category !== ApplicationCategory.HEADHUNTING)
                                throw new BadRequestException(Error.POST_IS_NOT_AT_CORRECT_CATEGORY);
                            break;
                        }
                        case ApplicationCategory.MATCHING: {
                            if (postExist.category !== ApplicationCategory.MATCHING)
                                throw new BadRequestException(Error.POST_IS_NOT_AT_CORRECT_CATEGORY);
                            break;
                        }
                        default: {
                            if (
                                Array<MemberLevel>(MemberLevel.GOLD, MemberLevel.PLATINUM, MemberLevel.SILVER).includes(
                                    team.leader.level,
                                ) &&
                                !record
                            ) {
                                throw new BadRequestException(Error.LEADER_IS_NOT_CERTIFIED_LEVEL);
                            }
                            break;
                        }
                    }
                    const headhunting = await prisma.team.findUnique({
                        where: {
                            id: body.id,
                            headhuntingRecommendations: {
                                some: {
                                    headhunting: {
                                        postId: body.postId,
                                    },
                                },
                            },
                        },
                        select: {
                            headhuntingRecommendations: {
                                where: {
                                    headhunting: {
                                        postId: body.postId,
                                    },
                                },
                                take: 1,
                            },
                        },
                    });
                    application = await prisma.application.upsert({
                        create: {
                            teamId: body.id,
                            postId: body.postId,
                            status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                            interview: {
                                create: {
                                    status: InterviewStatus.INTERVIEWING,
                                },
                            },
                            category: body.category,
                            headhuntingRecommendation: headhunting
                                ? {
                                      connect: {
                                          id: headhunting.headhuntingRecommendations[0].id,
                                      },
                                  }
                                : undefined,
                        },
                        update: {
                            status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                            interview: {
                                create: {
                                    status: InterviewStatus.INTERVIEWING,
                                },
                            },
                            category: body.category,
                        },
                        where: {
                            teamId_postId: {
                                teamId: body.id,
                                postId: body.postId,
                            },
                            post: {
                                company: {
                                    accountId,
                                },
                            },
                            status: PostApplicationStatus.APPLY,
                        },
                        select: {
                            id: true,
                        },
                    });
                    break;
                }
            }
            if (application) {
                const interview = await prisma.interview.findUnique({
                    where: {
                        applicationId: application.id,
                    },
                    select: {
                        id: true,
                        application: {
                            select: {
                                member: {
                                    select: {
                                        accountId: true,
                                    },
                                },
                                team: {
                                    select: {
                                        leader: {
                                            select: {
                                                accountId: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (interview) {
                    if (interview.application.member) {
                        await this.notificationMemberService.create(
                            interview.application.member.accountId,
                            '면접요청',
                            '지원현장에서 면접을 요청하였습니다',
                            NotificationType.INTERVIEW,
                            interview.id,
                        );
                    } else if (interview.application.team) {
                        await this.notificationMemberService.create(
                            interview.application.team.leader.accountId,
                            '면접요청',
                            '지원현장에서 면접을 요청하였습니다',
                            NotificationType.INTERVIEW,
                            interview.id,
                        );
                    }
                }
            }
        });
    }

    async getDetailTeamMember(accountId: number, memberId: number): Promise<ApplicationCompanyGetDetailMemberResponse> {
        const interview = await this.prismaService.interview.findFirst({
            where: {
                application: {
                    team: {
                        OR: [
                            {
                                members: {
                                    some: {
                                        memberId: memberId,
                                    },
                                },
                            },
                            {
                                leaderId: memberId,
                            },
                        ],
                    },
                    post: {
                        company: {
                            accountId: accountId,
                            isActive: true,
                        },
                    },
                },
            },
        });

        if (!interview) throw new BadRequestException(Error.INTERVIEW_NOT_FOUND);

        return await this.applicationCompanyService.getDetailTeamMember(accountId, memberId);
    }
}
