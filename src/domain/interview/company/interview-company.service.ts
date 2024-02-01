import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationCategory, InterviewStatus, PostApplicationStatus, Prisma, RequestObject } from '@prisma/client';
import { ApplicationCompanyService } from 'domain/application/company/application-company.service';
import { ApplicationCompanyGetDetailMemberResponse } from 'domain/application/company/response/application-company-get-detail-member.response';
import { ApplicationCompanyGetDetailTeamResponse } from 'domain/application/company/response/application-company-get-detail-team.response';
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

        if (!interview) throw new BadRequestException('No interview found');

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
                    post: {
                        company: {
                            accountId: accountId,
                        },
                    },
                },
            },
        });
        if (interview !== 0) {
            throw new ConflictException('Interview existed');
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
                    });
                    if (!member) throw new NotFoundException('Member not found');
                    const record = await prisma.application.findUnique({
                        where: {
                            memberId_postId: {
                                memberId: body.id,
                                postId: body.postId,
                            },
                        },
                        select: {
                            status: true,
                        },
                    });
                    if (record && record.status !== PostApplicationStatus.APPLY) {
                        throw new ConflictException('The application status is not set to APPLY');
                    }
                    switch (body.category) {
                        case ApplicationCategory.HEADHUNTING: {
                            const count = await prisma.headhunting.count({
                                where: {
                                    post: {
                                        id: body.postId,
                                        category: ApplicationCategory.HEADHUNTING,
                                    },
                                },
                            });
                            if (count === 0) throw new ConflictException('Post is not belong to headhunting type');
                            break;
                        }
                        case ApplicationCategory.MATCHING: {
                            const count = await prisma.post.count({
                                where: {
                                    id: body.postId,
                                    category: ApplicationCategory.MATCHING,
                                },
                            });
                            if (count === 0) throw new ConflictException('Post is not belong to matching type');
                            break;
                        }
                        default: {
                            const count = await this.prismaService.application.count({
                                where: {
                                    postId: body.postId,
                                    memberId: body.interviewProposalType === InterviewCompanyType.MEMBER ? body.id : undefined,
                                    teamId: body.interviewProposalType !== InterviewCompanyType.MEMBER ? body.id : undefined,
                                    post: {
                                        company: {
                                            accountId: accountId,
                                        },
                                    },
                                },
                            });
                            if (count === 0) {
                                const countMatching = await prisma.post.count({
                                    where: {
                                        id: body.postId,
                                        category: ApplicationCategory.MATCHING,
                                    },
                                });
                                if (countMatching !== 0) throw new ConflictException('Post is not belong to manpower type');
                                const countHeadhunting = await prisma.headhunting.count({
                                    where: {
                                        post: {
                                            id: body.postId,
                                            category: ApplicationCategory.HEADHUNTING,
                                        },
                                    },
                                });
                                if (countHeadhunting === 0) throw new ConflictException('Post is not belong to manpower type');
                            }
                            break;
                        }
                    }
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
                    });
                    if (!team) throw new NotFoundException('Team not found');
                    const record = await prisma.application.findUnique({
                        where: {
                            teamId_postId: {
                                teamId: body.id,
                                postId: body.postId,
                            },
                        },
                        select: {
                            status: true,
                        },
                    });
                    if (record && record.status !== PostApplicationStatus.APPLY) {
                        throw new ConflictException('The application status is not set to APPLY');
                    }
                    application = await prisma.application.upsert({
                        create: {
                            teamId: body.id,
                            postId: body.postId,
                            status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                            category: body.category,
                        },
                        update: {
                            status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                            category: body.category,
                        },
                        where: {
                            teamId_postId: {
                                teamId: body.id,
                                postId: body.postId,
                            },
                            status: PostApplicationStatus.APPLY,
                        },
                        select: {
                            id: true,
                            interview: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    });
                    if (application.interview) {
                        await prisma.interview.update({
                            where: {
                                id: application.interview.id,
                            },
                            data: {
                                isActive: true,
                                status: InterviewStatus.INTERVIEWING,
                            },
                        });
                    } else {
                        await prisma.interview.create({
                            data: {
                                applicationId: application.id,
                                status: InterviewStatus.INTERVIEWING,
                            },
                        });
                    }
                    break;
                }
            }
        });
    }
}
