import { BadRequestException, Injectable } from '@nestjs/common';
import { InterviewStatus, PostApplicationStatus, Prisma, RequestObject, SupportCategory } from '@prisma/client';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { MemberCompanyService } from 'domain/member/company/member-company.service';
import { CompanyTeamService } from 'domain/team/company/member-company.service';
import { TeamCompanyGetTeamDetailApplicants } from 'domain/team/company/response/team-company-get-team-detail.response';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { InterviewCompantGetListRequest } from './request/interview-company-get-list.request';
import { InterviewCompanyGetItemResponse } from './response/interview-company-get-item.response';

@Injectable()
export class InterviewCompanyService {
    constructor(
        private prismaService: PrismaService,
        private memberCompanyService: MemberCompanyService,
        private companyTeamService: CompanyTeamService,
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
                                        name: true,
                                    },
                                },
                                certificates: {
                                    select: {
                                        name: true,
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
                                                name: true,
                                            },
                                        },
                                        certificates: {
                                            select: {
                                                name: true,
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

        return await this.memberCompanyService.getMemberDetail(accountId, interview.applicationId);
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

        return await this.companyTeamService.getTeamDetail(accountId, interview.applicationId);
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
}
