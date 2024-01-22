import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InterviewStatus, PostApplicationStatus, Prisma, RequestObject } from '@prisma/client';
import { ApplicationCompanyService } from 'domain/application/company/application-company.service';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { TeamCompanyGetTeamDetailApplicants } from 'domain/team/company/response/team-company-get-detail-applicant.response';
import { PrismaService } from 'services/prisma/prisma.service';
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
            ...(query.result && { interviewStatus: query.result }),
            ...(query.startDate && {
                interviewRequestDate: { gte: new Date(query.startDate) },
            }),
            ...(query.endDate && {
                interviewRequestDate: { lte: new Date(query.endDate) },
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
                                specialLicenses: {
                                    where: {
                                        isActive: true,
                                    },
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
                                            where: {
                                                isActive: true,
                                            },
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
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.interview.count({
            where: queryFilter,
        });

        return new PaginationResponse(list, new PageInfo(listCount));
    }

    async getDetailMember(accountId: number, id: number): Promise<ApplicationCompanyGetMemberDetail> {
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

        if (!interview) throw new BadRequestException('No interview found');

        return await this.applicationCompanyService.getDetailMember(accountId, interview.applicationId);
    }

    async getDetailTeam(accountId: number, id: number): Promise<TeamCompanyGetTeamDetailApplicants> {
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

        if (!interview) throw new BadRequestException('No interview found');

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
        if (!interview) throw new NotFoundException('No interview found');
        await this.prismaService.interview.update({
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
        });
    }

    async create(body: InterviewCompanyProposeRequest, accountId: number): Promise<void> {
        const postExist = await this.prismaService.post.count({
            where: {
                isActive: true,
                id: body.postId,
                company: {
                    accountId,
                    isActive: true,
                },
            },
        });
        if (!postExist) throw new NotFoundException('Post does not exist');
        const interview = await this.prismaService.interview.count({
            where: {
                application: {
                    postId: body.postId,
                    memberId: body.interviewProposalType === InterviewCompanyType.MEMBER ? body.id : undefined,
                    teamId: body.interviewProposalType === InterviewCompanyType.TEAM ? body.id : undefined,
                },
            },
        });
        if (interview) {
            throw new ConflictException('Interview existed');
        }
        switch (body.interviewProposalType) {
            case InterviewCompanyType.MEMBER: {
                const member = await this.prismaService.member.findUnique({
                    where: {
                        id: body.id,
                    },
                });
                if (!member) throw new NotFoundException('Member not found');
                await this.prismaService.application.upsert({
                    create: {
                        memberId: body.id,
                        postId: body.postId,
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                        interview: {
                            create: {
                                status: InterviewStatus.INTERVIEWING,
                            },
                        },
                    },
                    update: {
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                        interview: {
                            create: {
                                status: InterviewStatus.INTERVIEWING,
                            },
                        },
                    },
                    where: {
                        memberId_postId: {
                            memberId: body.id,
                            postId: body.postId,
                        },
                        status: PostApplicationStatus.APPLY,
                    },
                });
                break;
            }
            case InterviewCompanyType.TEAM: {
                const team = await this.prismaService.team.findUnique({
                    where: {
                        id: body.id,
                    },
                });
                if (!team) throw new NotFoundException('Team not found');
                await this.prismaService.application.upsert({
                    create: {
                        teamId: body.id,
                        postId: body.postId,
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                        interview: {
                            create: {
                                status: InterviewStatus.INTERVIEWING,
                            },
                        },
                    },
                    update: {
                        status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                        interview: {
                            create: {
                                status: InterviewStatus.INTERVIEWING,
                            },
                        },
                    },
                    where: {
                        teamId_postId: {
                            teamId: body.id,
                            postId: body.postId,
                        },
                        status: PostApplicationStatus.APPLY,
                    },
                });
                break;
            }
        }
    }
}
