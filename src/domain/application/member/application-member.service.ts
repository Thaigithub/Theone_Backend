import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationCategory, InterviewStatus, PostApplicationStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ChangeApplicationStatus } from './enum/application-member-change-status.enum';
import { ApplicationMemberGetListOfferFilter } from './enum/application-member-get-list-offer-filter.enum';
import { OfferType } from './enum/application-member-get-list-offer-type.enum';
import { ApplicationMemberStatus } from './enum/application-member-status.enum';
import { ApplicationMemberGetListOfferRequest } from './request/application-member-get-list-offer.request';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
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
                leader: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const teamIds = [...teams.leader.map((item) => item.id), ...teams.teams.map((item) => item.teamId)];
        const status =
            query.status === ApplicationMemberStatus.FAIL
                ? {
                      status: PostApplicationStatus.REJECT_BY_COMPANY,
                      interview: undefined,
                  }
                : query.status === ApplicationMemberStatus.PASS
                  ? {
                        status: undefined,
                        interview: {
                            status: InterviewStatus.PASS,
                        },
                    }
                  : query.status === ApplicationMemberStatus.APPLY
                    ? {
                          status: undefined,
                          interview: null,
                      }
                    : query.status === ApplicationMemberStatus.PROPOSAL_INTERVIEW
                      ? {
                            status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                            NOT: {
                                interview: null,
                            },
                        }
                      : {
                            status: undefined,
                            interview: undefined,
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
                            interested: {
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
                                            file: true,
                                        },
                                    },
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
                    fileName: item.post.company.logo.file.fileName,
                    type: item.post.company.logo.file.type,
                    key: item.post.company.logo.file.key,
                    size: Number(item.post.company.logo.file.size),
                },
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
                        interested: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                        occupation: {
                            select: {
                                codeName: true,
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
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                key: true,
                                                fileName: true,
                                                type: true,
                                                size: true,
                                            },
                                        },
                                    },
                                },
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
                fileName: application.post.company.logo.file.fileName,
                type: application.post.company.logo.file.type,
                key: application.post.company.logo.file.key,
                size: Number(application.post.company.logo.file.size),
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
            occupationName: application.post.occupation ? application.post.occupation.codeName : null,
            isInterested: application.post.interested.length !== 0 ? true : false,
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

    async updateStatus(id: number, accountId: number, status: ChangeApplicationStatus): Promise<void> {
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
                    status === ChangeApplicationStatus.ACCEPT
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
                teams: {
                    select: {
                        teamId: true,
                    },
                },
                leader: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const teamIds = [...teams.leader.map((item) => item.id), ...teams.teams.map((item) => item.teamId)];
        const query = {
            where: {
                OR: [
                    {
                        team: {
                            id: {
                                in: teamIds,
                            },
                        },
                        member: null,
                    },
                    {
                        member: {
                            accountId,
                        },
                        team: null,
                    },
                ],
            },
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
                        interested: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                        endDate: true,
                        name: true,
                        occupation: {
                            select: {
                                codeName: true,
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
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                fileName: true,
                                                type: true,
                                                size: true,
                                                key: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            ...QueryPagingHelper.queryPaging(body),
        };
        switch (body.status) {
            case ApplicationMemberGetListOfferFilter.ACCEPTED: {
                query.where = {
                    ...query.where,
                    ...{
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
                    },
                };
                break;
            }
            case ApplicationMemberGetListOfferFilter.REJECTED: {
                query.where = {
                    ...query.where,
                    ...{
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
                    },
                };
                break;
            }
            case ApplicationMemberGetListOfferFilter.DEADLINE: {
                query.where = {
                    ...query.where,
                    ...{
                        interview: {
                            status: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        NOT: {
                            OR: [
                                { status: PostApplicationStatus.APPROVE_BY_MEMBER },
                                { status: PostApplicationStatus.REJECT_BY_MEMBER },
                            ],
                        },
                    },
                };
                break;
            }
            case ApplicationMemberGetListOfferFilter.TEAM_LEADER_WAITING: {
                query.where.OR[0].team.id.in = teams.teams.map((item) => item.teamId);
                query.where = {
                    ...query.where,
                    ...{
                        interview: {
                            status: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                            endDate: {
                                gt: Date(),
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_COMPANY,
                    },
                };
            }
            case ApplicationMemberGetListOfferFilter.WAITING: {
                query.where = {
                    ...query.where,
                    ...{
                        interview: {
                            status: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_COMPANY,
                    },
                };
                break;
            }
            default: {
                query.where = {
                    ...query.where,
                    ...{
                        interview: {
                            status: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                    },
                };
                break;
            }
        }
        const offer = (await this.prismaService.application.findMany(query)).map((item) => {
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
                    key: item.post.company.logo.file.key,
                    fileName: item.post.company.logo.file.fileName,
                    type: item.post.company.logo.file.type,
                    size: Number(item.post.company.logo.file.size),
                },
                postName: item.post.name,
                siteName: item.post.site ? item.post.site.name : '',
                siteAddress: item.post.site ? item.post.site.address : '',
                occupationName: item.post.occupation ? item.post.occupation.codeName : '',
                isInterested: item.post.interested.length === 0 ? false : true,
            };
        });
        const total = await this.prismaService.application.count({
            where: query.where,
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
