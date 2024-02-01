import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationCategory, InterviewStatus, PostApplicationStatus, PostStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationMemberGetListOfferFilter } from './enum/application-member-get-list-offer-filter.enum';
import { OfferType } from './enum/application-member-get-list-offer-type.enum';
import { ApplicationMemberStatus } from './enum/application-member-status.enum';
import { ApplicationMemberUpdateStatus } from './enum/application-member-update-status.enum';
import { ApplicationMemberGetListOfferRequest } from './request/application-member-get-list-offer.request';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
import { ApplicationMemberUpdateStatusRequest } from './request/application-member-update-status.request';
import { ApplicationMemberGetDetailResponse } from './response/application-member-get-detail.response';
import { ApplicationMemberGetListOfferResponse } from './response/application-member-get-list-offer.response';
import { ApplicationMemberGetListResponse } from './response/application-member-get-list.response';

@Injectable()
export class ApplicationMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(id: number, query: ApplicationMemberGetListRequest): Promise<ApplicationMemberGetListResponse> {
        const teams = await this.prismaService.member.findUnique({
            where: {
                accountId: id,
            },
            select: {
                teams: {
                    select: {
                        teamId: true,
                    },
                },
                leaders: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const teamIds = [...teams.leaders.map((item) => item.id), ...teams.teams.map((item) => item.teamId)];
        const status = {
            ...(query.status === ApplicationMemberStatus.FAIL && {
                OR: [{ status: PostApplicationStatus.REJECT_BY_COMPANY }, { status: PostApplicationStatus.REJECT_BY_MEMBER }],
                interview: undefined,
            }),
            ...(query.status === ApplicationMemberStatus.PASS && {
                status: undefined,
                interview: {
                    status: InterviewStatus.PASS,
                },
            }),
            ...(query.status === ApplicationMemberStatus.APPLY && {
                status: PostApplicationStatus.APPLY,
                interview: null,
            }),
            ...(query.status === ApplicationMemberStatus.PROPOSAL_INTERVIEW && {
                status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                NOT: {
                    interview: null,
                },
            }),
        };
        const queryFilter: Prisma.ApplicationWhereInput = {
            OR: [
                {
                    member: {
                        account: {
                            id,
                        },
                    },
                    ...status,
                },
                {
                    team: {
                        id: {
                            in: teamIds,
                        },
                    },
                    ...status,
                },
            ],
            AND: [
                { assignedAt: { gte: query.startDate && new Date(query.startDate) } },
                { assignedAt: { lte: query.endDate && new Date(query.endDate) } },
            ],
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
                                        accountId: id,
                                    },
                                },
                            },
                            id: true,
                            name: true,
                            endDate: true,
                            status: true,
                            code: {
                                select: {
                                    name: true,
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
                                    logo: true,
                                },
                            },
                        },
                    },
                },
                ...QueryPagingHelper.queryPaging(query),
                orderBy: {
                    assignedAt: 'desc',
                },
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

    async getDetail(id: number, accountId: number): Promise<ApplicationMemberGetDetailResponse> {
        const teams = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId: accountId,
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
        const application = await this.prismaService.application.findFirst({
            where: {
                OR: [
                    {
                        member: {
                            account: {
                                id: accountId,
                            },
                        },
                        id,
                    },
                    {
                        team: {
                            id: {
                                in: teams,
                            },
                        },
                        id,
                    },
                ],
            },
            select: {
                assignedAt: true,
                status: true,
                member: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
                team: {
                    select: {
                        name: true,
                        members: {
                            select: {
                                member: {
                                    select: {
                                        name: true,
                                        contact: true,
                                    },
                                },
                            },
                        },
                        leader: {
                            select: {
                                accountId: true,
                            },
                        },
                    },
                },
                post: {
                    select: {
                        interests: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                        code: {
                            select: {
                                name: true,
                            },
                        },
                        id: true,
                        name: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        site: {
                            select: {
                                personInCharge: true,
                                personInChargeContact: true,
                                email: true,
                                address: true,
                                name: true,
                                startDate: true,
                                endDate: true,
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
        });
        if (!application) throw new NotFoundException('Application not found');
        return {
            isLeader: application.team?.leader.accountId === accountId || null,
            companyLogo: {
                fileName: application.post.company.logo.fileName,
                type: application.post.company.logo.type,
                key: application.post.company.logo.key,
                size: Number(application.post.company.logo.size),
            },
            companyName: application.post.company.name,
            companyId: application.post.company.id,
            postId: application.post.id,
            postName: application.post.name,
            postStatus: application.post.status,
            siteAddress: application.post.site ? application.post.site.address : '',
            siteStartDate: application.post.site ? application.post.site.startDate : null,
            siteEndDate: application.post.site ? application.post.site.endDate : null,
            siteName: application.post.site ? application.post.site.name : '',
            sitePersonInCharge: application.post.site ? application.post.site.personInCharge : '',
            sitePersonInChargeContact: application.post.site ? application.post.site.personInChargeContact : '',
            siteEmail: application.post.site ? application.post.site.email : '',
            postEndDate: application.post.endDate,
            postStartDate: application.post.startDate,
            status: application.status,
            appliedDate: application.assignedAt,
            occupationName: application.post.code ? application.post.code.name : null,
            isInterested: application.post.interests.length !== 0 ? true : false,
            team: application.team
                ? {
                      name: application.team.name,
                      members: application.team.members.map((item) => {
                          return { name: item.member.name, contact: item.member.contact };
                      }),
                  }
                : null,
            member: application.member
                ? {
                      name: application.member.name,
                      contact: application.member.contact,
                  }
                : null,
        };
    }

    async updateStatus(id: number, accountId: number, body: ApplicationMemberUpdateStatusRequest): Promise<void> {
        const application = await this.prismaService.application.findFirst({
            where: {
                OR: [
                    {
                        id,
                        member: {
                            accountId,
                        },
                    },
                    {
                        id,
                        team: {
                            leaderId: accountId,
                        },
                    },
                ],
            },
            select: {
                status: true,
                interview: {
                    select: {
                        status: true,
                    },
                },
            },
        });
        if (!application) throw new NotFoundException('Application not found');
        if (
            application.status !== PostApplicationStatus.APPROVE_BY_COMPANY ||
            (application.interview && application.interview.status !== InterviewStatus.PASS)
        )
            throw new BadRequestException('Application is not at the correct status to change');
        await this.prismaService.application.update({
            where: {
                id,
            },
            data: {
                status:
                    body.status === ApplicationMemberUpdateStatus.ACCEPT
                        ? PostApplicationStatus.APPROVE_BY_MEMBER
                        : PostApplicationStatus.REJECT_BY_MEMBER,
            },
        });
    }

    async getListOffer(
        accountId: number,
        body: ApplicationMemberGetListOfferRequest,
    ): Promise<ApplicationMemberGetListOfferResponse> {
        const teams = await this.prismaService.member.findUnique({
            where: {
                accountId,
            },
            select: {
                id: true,
                teams: {
                    select: {
                        teamId: true,
                        team: {
                            select: {
                                leaderId: true,
                            },
                        },
                    },
                },
                leaders: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const teamIds = [...teams.leaders.map((item) => item.id), ...teams.teams.map((item) => item.teamId)];
        const onlyTeamIds = teams.teams
            .filter((item) => {
                return item.team.leaderId !== teams.id;
            })
            .map((item) => {
                return item.teamId;
            });
        const onlyLeaderIds = teams.leaders.map((item) => {
            return item.id;
        });
        const queryFilter: Prisma.ApplicationWhereInput = {
            OR: [
                {
                    team: {
                        ...(body.status !== ApplicationMemberGetListOfferFilter.TEAM_LEADER_WAITING &&
                            body.status !== ApplicationMemberGetListOfferFilter.WAITING && {
                                id: {
                                    in: teamIds,
                                },
                            }),
                        ...(body.status === ApplicationMemberGetListOfferFilter.TEAM_LEADER_WAITING && {
                            id: {
                                in: onlyTeamIds,
                            },
                        }),
                        ...(body.status === ApplicationMemberGetListOfferFilter.WAITING && {
                            id: {
                                in: onlyLeaderIds,
                            },
                        }),
                    },
                    member: null,
                },
                {
                    ...(body.status !== ApplicationMemberGetListOfferFilter.TEAM_LEADER_WAITING && {
                        member: {
                            accountId,
                        },
                        team: null,
                    }),
                },
            ],
            ...(body.status === ApplicationMemberGetListOfferFilter.ACCEPTED && {
                interview: {
                    status: InterviewStatus.PASS,
                },
                post: {
                    name: {
                        contains: body.postName,
                        mode: 'insensitive',
                    },
                },
                status: PostApplicationStatus.APPROVE_BY_MEMBER,
            }),
            ...(body.status === ApplicationMemberGetListOfferFilter.REJECTED && {
                interview: {
                    status: InterviewStatus.PASS,
                },
                post: {
                    name: {
                        contains: body.postName,
                        mode: 'insensitive',
                    },
                },
                status: PostApplicationStatus.REJECT_BY_MEMBER,
            }),
            ...(body.status === ApplicationMemberGetListOfferFilter.DEADLINE && {
                post: {
                    name: {
                        contains: body.postName,
                        mode: 'insensitive',
                    },
                    endDate: {
                        lte: new Date(),
                    },
                },
                status: PostApplicationStatus.APPLY,
            }),
            ...(body.status === ApplicationMemberGetListOfferFilter.WAITING && {
                interview: {
                    status: InterviewStatus.PASS,
                },
                post: {
                    name: {
                        contains: body.postName,
                        mode: 'insensitive',
                    },
                    NOT: { status: PostStatus.DEADLINE },
                },
                status: PostApplicationStatus.APPROVE_BY_COMPANY,
            }),
            ...(body.status === ApplicationMemberGetListOfferFilter.TEAM_LEADER_WAITING && {
                interview: {
                    status: InterviewStatus.PASS,
                },
                post: {
                    name: {
                        contains: body.postName,
                        mode: 'insensitive',
                    },
                    NOT: { status: PostStatus.DEADLINE },
                },
                status: PostApplicationStatus.APPROVE_BY_COMPANY,
            }),
            ...(!body.status && {
                interview: {
                    status: InterviewStatus.PASS,
                },
                post: {
                    name: {
                        contains: body.postName,
                        mode: 'insensitive',
                    },
                },
            }),
        };

        const offer = (
            await this.prismaService.application.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    category: true,
                    team: {
                        select: {
                            name: true,
                            leader: {
                                select: {
                                    accountId: true,
                                },
                            },
                        },
                    },
                    memberId: true,
                    assignedAt: true,
                    status: true,
                    interview: {
                        select: {
                            status: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            interests: {
                                where: {
                                    member: {
                                        accountId,
                                    },
                                },
                            },
                            endDate: true,
                            name: true,
                            code: {
                                select: {
                                    name: true,
                                },
                            },
                            site: {
                                select: {
                                    address: true,
                                    name: true,
                                },
                            },
                            company: {
                                select: {
                                    logo: true,
                                },
                            },
                        },
                    },
                },
                ...QueryPagingHelper.queryPaging(body),
            })
        ).map((item) => {
            return {
                isLeader: item.team ? item.team.leader.accountId === accountId : null,
                isHeadhunting: item.category === ApplicationCategory.HEADHUNTING,
                postId: item.post.id,
                endDate: item.post.endDate,
                type: item.team ? OfferType.TEAM : OfferType.INDIVIDUAL,
                id: item.id,
                requestDate: new Date(item.assignedAt).toISOString(),
                applicationStatus: item.status,
                teamName: item.team ? item.team.name : '',
                companyLogo: {
                    key: item.post.company.logo.key,
                    fileName: item.post.company.logo.fileName,
                    type: item.post.company.logo.type,
                    size: Number(item.post.company.logo.size),
                },
                postName: item.post.name,
                siteName: item.post.site ? item.post.site.name : '',
                siteAddress: item.post.site ? item.post.site.address : '',
                occupationName: item.post.code ? item.post.code.name : '',
                isInterested: item.post.interests.length === 0 ? false : true,
            };
        });
        const total = await this.prismaService.application.count({
            where: queryFilter,
        });
        return new PaginationResponse(offer, new PageInfo(total));
    }

    async getTotal(accountId: number, isInProgress: boolean = false): Promise<number> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                accountId,
            },
        });
        if (!memberExist) throw new NotFoundException('Member does not exist');

        return await this.prismaService.application.count({
            where: {
                member: {
                    accountId,
                },
                contract: isInProgress ? null : undefined,
            },
        });
    }
}
