import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InvitationStatus, NotificationType, Prisma, TeamStatus } from '@prisma/client';
import { NotificationMemberService } from 'domain/notification/member/notification-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TeamMemberCreateInvitationRequest } from './request/team-member-get-invite.request';
import { TeamMemberUpdateExposureRequest } from './request/team-member-update-exposure.request';
import { TeamMemberUpdateInvitationStatus } from './request/team-member-update-invitation-status.request';
import { TeamMemberUpsertRequest } from './request/team-member-upsert.request';
import { TeamMemberGetDetailResponse } from './response/team-member-get-detail.response';
import { TeamMemberGetListInvitationResponse } from './response/team-member-get-list-invitation.response';
import { TeamMemberGetListResponse } from './response/team-member-get-list.response';

@Injectable()
export class TeamMemberService {
    constructor(
        private prismaService: PrismaService,
        private notificationMemberService: NotificationMemberService,
    ) {}

    getTeamCode(sequenceDigit: string): string {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(0, 2);
        const month = currentDate.getMonth() < 10 ? '0' + currentDate.getMonth().toString() : currentDate.getMonth().toString();
        const day = currentDate.getDate() < 10 ? '0' + currentDate.getDate().toString() : currentDate.getDate().toString();
        return `${year}${month}${day}${sequenceDigit}`;
    }

    async checkTeamPermission(accountId: number, teamId: number): Promise<void> {
        const team = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                leader: {
                    accountId,
                },
                isActive: true,
            },
            select: {
                status: true,
            },
        });
        if (!team) {
            throw new BadRequestException(Error.PERMISSION_DENIED);
        }
        if (team.status == TeamStatus.STOPPED) {
            throw new BadRequestException(Error.TEAM_IS_STOPPED_BY_ADMIN);
        }
    }

    async create(accountId: number, request: TeamMemberUpsertRequest): Promise<void> {
        await this.prismaService.team.create({
            data: {
                name: request.teamName,
                region: {
                    connect: { id: request.dictrictId },
                },
                leader: {
                    connect: {
                        accountId,
                    },
                },
                introduction: request.introduction,
                code: {
                    connect: {
                        id: request.codeId,
                    },
                },
                teamCode: this.getTeamCode(request.sequence),
                totalMembers: 1,
            },
        });
    }

    async getList(accountId: number, query: PaginationRequest): Promise<TeamMemberGetListResponse> {
        const queryFilter: Prisma.TeamWhereInput = {
            OR: [
                {
                    leader: {
                        accountId,
                    },
                },
                {
                    members: {
                        some: {
                            member: {
                                accountId,
                            },
                            isActive: true,
                        },
                    },
                },
            ],
            isActive: true,
        };
        const teams = (
            await this.prismaService.team.findMany({
                where: queryFilter,
                include: {
                    leader: true,
                    code: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        },
                    },
                    members: {
                        where: {
                            isActive: true,
                        },
                        select: {
                            member: {
                                select: {
                                    id: true,
                                    isActive: true,
                                    name: true,
                                    contact: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: Prisma.SortOrder.desc,
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((team) => {
            return {
                id: team.id,
                name: team.name,
                status: team.status,
                code: {
                    id: team.code.id,
                    codeName: team.code.name,
                    code: team.code.code,
                },
                exposureStatus: team.leader.accountId === accountId ? team.exposureStatus : null,
                isActive: team.leader.accountId === accountId ? team.isActive : null,
                numberOfRecruitments: team.numberOfRecruitments,
                leaderName: team.leader.name,
                isLeader: accountId === team.leader.accountId,
                totalMembers: team.totalMembers,
                createdAt: team.createdAt,
                memberInfors: team.members
                    .filter((item) => item.member.isActive)
                    .map((item) => {
                        return {
                            id: item.member.id,
                            name: item.member.name,
                            contact: item.member.contact,
                        };
                    })
                    .concat({
                        id: team.leaderId,
                        name: team.leader.name,
                        contact: team.leader.contact,
                    }),
            };
        });
        const teamListCount = await this.prismaService.team.count({
            where: queryFilter,
        });
        return new PaginationResponse(teams, new PageInfo(teamListCount));
    }

    async getDetail(accountId: number, id: number): Promise<TeamMemberGetDetailResponse> {
        const team = await this.prismaService.team.findUnique({
            where: {
                id: id,
                isActive: true,
                OR: [
                    {
                        leader: {
                            accountId,
                        },
                    },
                    {
                        members: {
                            some: {
                                member: {
                                    accountId,
                                },
                                isActive: true,
                            },
                        },
                    },
                ],
            },
            select: {
                code: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                name: true,
                region: {
                    select: {
                        id: true,
                        districtEnglishName: true,
                        districtKoreanName: true,
                        cityEnglishName: true,
                        cityKoreanName: true,
                    },
                },
                introduction: true,
                createdAt: true,
                leader: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        accountId: true,
                    },
                },
            },
        });
        if (!team) throw new NotFoundException(Error.TEAM_NOT_FOUND);

        const members = await this.prismaService.membersOnTeams.findMany({
            where: {
                teamId: id,
                isActive: true,
            },
            select: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                    },
                },
            },
        });

        const memberInvitaions =
            team.leader.accountId === accountId
                ? await this.prismaService.teamInvitation.findMany({
                      where: {
                          teamId: id,
                          isActive: true,
                      },
                      select: {
                          id: true,
                          member: {
                              select: {
                                  id: true,
                                  name: true,
                                  contact: true,
                              },
                          },
                          status: true,
                      },
                  })
                : [];
        return {
            isLeader: team.leader.accountId === accountId,
            team: {
                name: team.name,
                city: {
                    id: team.region.id,
                    koreanName: team.region.cityKoreanName,
                    englishName: team.region.cityEnglishName,
                },
                district: {
                    id: team.region.id,
                    koreanName: team.region.districtKoreanName,
                    englishName: team.region.districtEnglishName,
                },
                introduction: team.introduction,
                createdAt: team.createdAt,
                code: {
                    id: team.code.id,
                    codeName: team.code.name,
                    code: team.code.code,
                },
                leaderName: team.leader.name,
                leaderContact: team.leader.contact,
            },
            members: members
                .filter((memberInfor) => memberInfor.member.id !== team.leader.id)
                .map((memberInfo) => ({
                    id: memberInfo.member.id,
                    name: memberInfo.member.name,
                    contact: memberInfo.member.contact,
                })),
            memberInvitations: memberInvitaions.map((memberInfor) => ({
                id: memberInfor.id,
                memberId: memberInfor.member.id,
                name: memberInfor.member.name,
                contact: memberInfor.member.contact,
                invitationStatus: memberInfor.status,
            })),
        };
    }

    async update(accountId: number, teamId: number, request: TeamMemberUpsertRequest): Promise<void> {
        await this.checkTeamPermission(accountId, teamId);
        await this.prismaService.team.update({
            where: {
                id: teamId,
                isActive: true,
            },
            data: {
                updatedAt: new Date(),
                name: request.teamName,
                introduction: request.introduction,
                code: {
                    connect: {
                        id: request.codeId,
                    },
                },
                region: {
                    connect: {
                        id: request.dictrictId,
                    },
                },
            },
        });
    }

    async updateExposure(accountId: number, teamId: number, payload: TeamMemberUpdateExposureRequest): Promise<void> {
        await this.checkTeamPermission(accountId, teamId);
        const team = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                leader: {
                    accountId,
                },
                isActive: true,
            },
            select: {
                exposureStatus: true,
            },
        });
        if (team.exposureStatus !== payload.exposureStatus) {
            await this.prismaService.team.update({
                where: {
                    id: teamId,
                    leader: {
                        accountId,
                    },
                    isActive: true,
                },
                data: {
                    exposureStatus: payload.exposureStatus,
                },
            });
        }
    }

    async createInvitation(accountId: number, teamId: number, body: TeamMemberCreateInvitationRequest) {
        await this.checkTeamPermission(accountId, teamId);
        const member = await this.prismaService.member.findUnique({
            where: {
                id: body.id,
            },
            select: {
                name: true,
            },
        });
        if (!member) throw new NotFoundException(Error.MEMBER_NOT_FOUND);
        const memberOnTeam = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                isActive: true,
                OR: [
                    {
                        members: {
                            some: {
                                memberId: body.id,
                                isActive: true,
                            },
                        },
                    },
                    {
                        leader: {
                            id: body.id,
                            isActive: true,
                        },
                    },
                ],
            },
        });
        if (memberOnTeam) throw new BadRequestException(Error.MEMBER_EXISTED);
        const teamMemberInvitation = await this.prismaService.teamInvitation.findFirst({
            where: {
                memberId: body.id,
                teamId: teamId,
            },
            select: {
                isActive: true,
                id: true,
                status: true,
            },
        });
        let teamInvitation = null;
        if (teamMemberInvitation) {
            if (teamMemberInvitation.isActive) {
                if (teamMemberInvitation.status === InvitationStatus.DECLIENED) {
                    teamInvitation = await this.prismaService.teamInvitation.update({
                        where: {
                            id: teamMemberInvitation.id,
                            isActive: true,
                        },
                        data: {
                            status: InvitationStatus.REQUESTED,
                            updatedAt: new Date(),
                        },
                        select: {
                            id: true,
                            member: {
                                select: {
                                    accountId: true,
                                },
                            },
                        },
                    });
                }
            } else {
                teamInvitation = await this.prismaService.teamInvitation.update({
                    where: {
                        id: teamMemberInvitation.id,
                    },
                    data: {
                        isActive: true,
                        status: InvitationStatus.REQUESTED,
                        updatedAt: new Date(),
                    },
                    select: {
                        id: true,
                        member: {
                            select: {
                                accountId: true,
                            },
                        },
                    },
                });
            }
        } else {
            teamInvitation = await this.prismaService.teamInvitation.create({
                data: {
                    isActive: true,
                    status: InvitationStatus.REQUESTED,
                    member: {
                        connect: {
                            id: body.id,
                        },
                    },
                    team: {
                        connect: {
                            id: teamId,
                        },
                    },
                },
                select: {
                    id: true,
                    member: {
                        select: {
                            accountId: true,
                        },
                    },
                },
            });
        }
        if (teamInvitation) {
            const host = await this.prismaService.member.findUnique({
                where: {
                    accountId: accountId,
                },
                select: {
                    name: true,
                },
            });
            await this.notificationMemberService.create(
                teamInvitation.member.accountId,
                host.name + ' 님이 최강크루에 초대하셨습니다. 초대를 수락하시겠습니까?',
                '',
                NotificationType.TEAM,
                teamInvitation.id,
            );
        }
    }

    async deleteInvitation(accountId: number, teamId: number, inviteId: number) {
        await this.checkTeamPermission(accountId, teamId);
        await this.prismaService.$transaction(async (prisma) => {
            const memberInvitaion = await prisma.teamInvitation.findUnique({
                where: {
                    id: inviteId,
                    isActive: true,
                },
            });
            if (memberInvitaion.status === InvitationStatus.REQUESTED) {
                await prisma.teamInvitation.update({
                    where: {
                        id: inviteId,
                    },
                    data: {
                        isActive: false,
                        updatedAt: new Date(),
                    },
                });
            } else {
                throw new NotFoundException(Error.INVITATION_HAS_BEEN_ACCEPTED);
            }
        });
    }

    async delete(accountId: number, teamId: number) {
        await this.checkTeamPermission(accountId, teamId);
        const applications = await this.prismaService.application.findFirst({
            where: {
                team: {
                    id: teamId,
                    isActive: true,
                },
                contract: {
                    startDate: {
                        lte: new Date(),
                    },
                    endDate: {
                        gte: new Date(),
                    },
                },
            },
        });
        if (applications) throw new ConflictException(Error.TEAM_IS_UNDER_CONTRACT);
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.team.update({
                where: {
                    id: teamId,
                    isActive: true,
                },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                },
            });
            const queryInput = {
                where: {
                    teamId: teamId,
                    isActive: true,
                },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                },
            };
            await prisma.membersOnTeams.updateMany({
                ...queryInput,
            });
            await prisma.teamInvitation.updateMany({
                ...queryInput,
            });
        });
    }

    async getListInvitation(accountId: number, query: PaginationRequest): Promise<TeamMemberGetListInvitationResponse> {
        const search = {
            where: {
                member: {
                    accountId,
                },
                isActive: true,
            },
            select: {
                id: true,
                teamId: true,
                memberId: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                        leader: {
                            select: {
                                name: true,
                                contact: true,
                            },
                        },
                        introduction: true,
                    },
                },
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: Prisma.SortOrder.desc,
            },
            ...QueryPagingHelper.queryPaging(query),
        };
        const invitations = (await this.prismaService.teamInvitation.findMany(search)).map((invitation) => {
            return {
                id: invitation.id,
                teamId: invitation.teamId,
                memberId: invitation.memberId,
                teamName: invitation.team.name,
                leaderName: invitation.team.leader.name,
                contact: invitation.team.leader.contact,
                invitationDate: invitation.updatedAt ? invitation.updatedAt : invitation.createdAt,
                introduction: invitation.team.introduction,
                invitationStatus: invitation.status,
            };
        });
        const invitaionListCount = await this.prismaService.teamInvitation.count({
            where: search.where,
        });
        return new PaginationResponse(invitations, new PageInfo(invitaionListCount));
    }

    async updateInvitationStatus(accountId: number, inviteId: number, body: TeamMemberUpdateInvitationStatus): Promise<void> {
        const teamInvitation = await this.prismaService.teamInvitation.findUnique({
            where: {
                id: inviteId,
                isActive: true,
                team: {
                    isActive: true,
                },
                member: {
                    accountId,
                },
            },
            select: {
                teamId: true,
                team: {
                    select: {
                        totalMembers: true,
                    },
                },
                status: true,
            },
        });
        if (!teamInvitation) throw new NotFoundException(Error.INVITATION_NOT_FOUND);
        if (teamInvitation.status !== InvitationStatus.REQUESTED) throw new ConflictException(Error.INVITATION_HAS_BEEN_ACCEPTED);
        if (body.status === InvitationStatus.DECLIENED) {
            await this.prismaService.teamInvitation.update({
                where: {
                    id: inviteId,
                },
                data: {
                    status: InvitationStatus.DECLIENED,
                    updatedAt: new Date(),
                },
            });
        }
        if (body.status === InvitationStatus.ACCEPTED) {
            await this.prismaService.$transaction(async (prisma) => {
                const memberOnTeam = await prisma.membersOnTeams.findFirst({
                    where: {
                        member: {
                            accountId,
                        },
                        teamId: teamInvitation.teamId,
                    },
                    select: {
                        isActive: true,
                    },
                });
                if (memberOnTeam && !memberOnTeam.isActive) {
                    await prisma.membersOnTeams.updateMany({
                        where: {
                            member: {
                                accountId,
                            },
                            teamId: teamInvitation.teamId,
                        },
                        data: {
                            updatedAt: new Date(),
                            isActive: true,
                        },
                    });
                    await this.prismaService.team.update({
                        where: {
                            id: teamInvitation.teamId,
                            isActive: true,
                        },
                        data: {
                            totalMembers: teamInvitation.team.totalMembers + 1,
                        },
                    });
                } else if (!memberOnTeam) {
                    await prisma.membersOnTeams.create({
                        data: {
                            member: {
                                connect: {
                                    accountId,
                                },
                            },
                            team: {
                                connect: {
                                    id: teamInvitation.teamId,
                                },
                            },
                            isActive: true,
                        },
                    });
                    await this.prismaService.team.update({
                        where: {
                            id: teamInvitation.teamId,
                            isActive: true,
                        },
                        data: {
                            totalMembers: teamInvitation.team.totalMembers + 1,
                        },
                    });
                }
                await prisma.teamInvitation.update({
                    where: {
                        id: inviteId,
                        isActive: true,
                    },
                    data: {
                        status: InvitationStatus.ACCEPTED,
                        updatedAt: new Date(),
                    },
                });
            });
        }
    }
}
