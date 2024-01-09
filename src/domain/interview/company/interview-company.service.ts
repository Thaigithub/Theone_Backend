import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Application, InterviewStatus, PostApplicationStatus, Prisma, RequestObject, SupportCategory } from '@prisma/client';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { MemberCompanyService } from 'domain/member/company/member-company.service';
import { TeamCompanyGetTeamDetailApplicants } from 'domain/team/company/response/team-company-get-team-detail.response';
import { TeamCompanyService } from 'domain/team/company/team-company.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { InterviewProposalType } from './dto/interview-company-propose.enum';
import { InterviewCompantGetListRequest } from './request/interview-company-get-list.request';
import { InterviewCompanyProposeRequest } from './request/interview-company-propose.request';
import { InterviewCompanyGetItemResponse } from './response/interview-company-get-item.response';

@Injectable()
export class InterviewCompanyService {
    constructor(
        private prismaService: PrismaService,
        private memberCompanyService: MemberCompanyService,
        private teamCompanyService: TeamCompanyService,
    ) {}

    async getList(accountId: number, query: InterviewCompantGetListRequest): Promise<InterviewCompanyGetItemResponse> {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const queryFilter: Prisma.InterviewWhereInput = {
            application: {
                post: {
                    companyId: account.company.id,
                },
            },
            ...(query.object === RequestObject.INDIVIDUAL && {
                application: {
                    team: null,
                    post: {
                        companyId: account.company.id,
                    },
                },
            }),
            ...(query.object === RequestObject.TEAM && {
                application: {
                    member: null,
                    post: {
                        companyId: account.company.id,
                    },
                },
            }),
            ...(query.supportCategory && { supportCategory: SupportCategory[query.supportCategory] }),
            ...(query.interviewResult && { interviewStatus: InterviewStatus[query.interviewResult] }),
            ...(query.interviewRequestStartDate && {
                interviewRequestDate: { gte: new Date(query.interviewRequestStartDate) },
            }),
            ...(query.interviewRequestEndDate && {
                interviewRequestDate: { lte: new Date(query.interviewRequestEndDate) },
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
                supportCategory: true,
                interviewStatus: true,
                interviewRequestDate: true,
                application: {
                    select: {
                        member: {
                            select: {
                                name: true,
                                contact: true,
                                specialLicenses: {
                                    select: {
                                        code: {
                                            select: {
                                                codeName: true,
                                            },
                                        },
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
                                        specialLicenses: {
                                            select: {
                                                code: {
                                                    select: {
                                                        codeName: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
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
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.interview.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(listCount));
    }

    async getMemberDetail(accountId: number, id: number): Promise<ApplicationCompanyGetMemberDetail> {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const interview = await this.prismaService.interview.findUnique({
            where: {
                id,
                application: {
                    post: {
                        companyId: account.company.id,
                    },
                },
            },
        });

        if (!interview) throw new BadRequestException('No interview found');
        return await this.memberCompanyService.getMemberDetail(interview.applicationId);
    }

    async getTeamDetail(accountId: number, id: number): Promise<TeamCompanyGetTeamDetailApplicants> {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const interview = await this.prismaService.interview.findUnique({
            where: {
                id,
                application: {
                    post: {
                        companyId: account.company.id,
                    },
                },
            },
        });

        if (!interview) throw new BadRequestException('No interview found');

        return await this.teamCompanyService.getTeamDetail(interview.applicationId);
    }

    async resultInterview(accountId: number, id: number, result: InterviewStatus) {
        const account = await this.prismaService.account.findUniqueOrThrow({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        try {
            await this.prismaService.interview.update({
                where: {
                    id,
                    application: {
                        post: {
                            companyId: account.company.id,
                        },
                    },
                },
                data: {
                    interviewStatus: result,
                    application: {
                        update: {
                            status:
                                result === InterviewStatus.PASS
                                    ? PostApplicationStatus.APPROVE_BY_COMPANY
                                    : PostApplicationStatus.REJECT_BY_COMPANY,
                        },
                    },
                },
            });
        } catch (error) {
            throw new BadRequestException('No interview found');
        }
    }

    async proposeInterview(body: InterviewCompanyProposeRequest): Promise<void> {
        const postExist = await this.prismaService.post.count({
            where: {
                isActive: true,
                id: body.postId,
            },
        });
        if (!postExist) throw new NotFoundException('Post does not exist');

        // Check interview exist or not
        const interviewExist = await this.prismaService.interview.count({
            where: {
                application: {
                    postId: body.postId,
                    memberId: body.interviewProposalType === InterviewProposalType.MEMBER ? body.memberOrTeamId : undefined,
                    teamId: body.interviewProposalType === InterviewProposalType.TEAM ? body.memberOrTeamId : undefined,
                },
            },
        });

        if (interviewExist) {
            throw new BadRequestException(
                'Interview for that member or team already existed. Can not propose for a new interview.',
            );
        }

        let proposeApplication: Application;

        switch (body.interviewProposalType) {
            case InterviewProposalType.MEMBER:
                const memberExist = await this.prismaService.member.count({
                    where: {
                        isActive: true,
                        id: body.memberOrTeamId,
                    },
                });
                if (!memberExist) throw new NotFoundException('Member does not exist');
                proposeApplication = await this.prismaService.application.upsert({
                    create: {
                        memberId: body.memberOrTeamId,
                        postId: body.postId,
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                    },
                    update: {
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                    },
                    where: {
                        memberId_postId: {
                            memberId: body.memberOrTeamId,
                            postId: body.postId,
                        },
                        status: PostApplicationStatus.APPLY,
                    },
                });
                break;
            case InterviewProposalType.TEAM:
                const teamExist = await this.prismaService.team.count({
                    where: {
                        isActive: true,
                        id: body.memberOrTeamId,
                    },
                });
                if (!teamExist) throw new NotFoundException('Team does not exist');
                proposeApplication = await this.prismaService.application.upsert({
                    create: {
                        teamId: body.memberOrTeamId,
                        postId: body.postId,
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                    },
                    update: {
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                    },
                    where: {
                        teamId_postId: {
                            teamId: body.memberOrTeamId,
                            postId: body.postId,
                        },
                        status: PostApplicationStatus.APPLY,
                    },
                });
                break;
        }

        await this.prismaService.interview.create({
            data: {
                applicationId: proposeApplication.id,
                supportCategory: SupportCategory.MANPOWER,
                interviewStatus: InterviewStatus.INTERVIEWING,
            },
        });
    }
}
