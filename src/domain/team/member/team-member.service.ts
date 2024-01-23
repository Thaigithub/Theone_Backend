import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InvitationStatus, Prisma, TeamStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
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
    constructor(private readonly prismaService: PrismaService) {}

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
            throw new BadRequestException('You do not have permission to update this team');
        }
        if (team.status == TeamStatus.STOPPED) {
            throw new BadRequestException('The team had been forced to be stopped activity by administrator');
        }
    }

    async create(accountId: number, request: TeamMemberUpsertRequest): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.team.create({
                data: {
                    name: request.teamName,
                    district: {
                        connect: {
                            id: request.dictrictId,
                        },
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
        });
    }

    async getList(accountId: number, query: PaginationRequest): Promise<TeamMemberGetListResponse> {
        const search = {
            where: {
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
            },
            include: {
                leader: true,
                code: {
                    select: {
                        id: true,
                        codeName: true,
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
        };
        const teams = (await this.prismaService.team.findMany(search)).map((team) => ({
            id: team.id,
            name: team.name,
            status: team.status,
            code: team.code,
            exposureStatus: team.exposureStatus,
            isActive: team.isActive,
            numberOfRecruitments: team.numberOfRecruitments,
            leaderName: team.leader.name,
            isLeader: accountId === team.leader.id ? true : false,
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
        }));
        const teamListCount = await this.prismaService.team.count({
            where: search.where,
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
                        codeName: true,
                        code: true,
                    },
                },
                name: true,
                district: {
                    select: {
                        id: true,
                        englishName: true,
                        koreanName: true,
                        city: {
                            select: {
                                id: true,
                                englishName: true,
                                koreanName: true,
                            },
                        },
                    },
                },
                introduction: true,
                createdAt: true,
                leader: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                    },
                },
            },
        });
        if (!team) throw new NotFoundException(`Team with id ${id} not found`);

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
        const memberInvitaions = await this.prismaService.teamMemberInvitation.findMany({
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
                invitationStatus: true,
            },
        });
        return {
            team: {
                name: team.name,
                city: {
                    id: team.district.city.id,
                    koreanName: team.district.city.koreanName,
                    englishName: team.district.city.englishName,
                },
                district: {
                    id: team.district.id,
                    koreanName: team.district.koreanName,
                    englishName: team.district.englishName,
                },
                introduction: team.introduction,
                createdAt: team.createdAt,
                code: team.code,
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
                invitationStatus: memberInfor.invitationStatus,
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
                district: {
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
        });
        if (!member) throw new NotFoundException('Member not found');
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
        if (memberOnTeam) throw new BadRequestException('Member has been on team');
        const teamMemberInvitation = await this.prismaService.teamMemberInvitation.findFirst({
            where: {
                memberId: body.id,
                teamId: teamId,
            },
            select: {
                isActive: true,
                id: true,
                invitationStatus: true,
            },
        });
        if (teamMemberInvitation) {
            if (teamMemberInvitation.isActive) {
                if (teamMemberInvitation.invitationStatus === InvitationStatus.DECLIENED) {
                    await this.prismaService.teamMemberInvitation.update({
                        where: {
                            id: teamMemberInvitation.id,
                            isActive: true,
                        },
                        data: {
                            invitationStatus: InvitationStatus.REQUESTED,
                            updatedAt: new Date(),
                        },
                    });
                }
            } else {
                await this.prismaService.teamMemberInvitation.update({
                    where: {
                        id: teamMemberInvitation.id,
                    },
                    data: {
                        isActive: true,
                        invitationStatus: InvitationStatus.REQUESTED,
                        updatedAt: new Date(),
                    },
                });
            }
        } else {
            await this.prismaService.teamMemberInvitation.create({
                data: {
                    isActive: true,
                    invitationStatus: InvitationStatus.REQUESTED,
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
            });
        }
    }

    async deleteInvitation(accountId: number, teamId: number, inviteId: number) {
        await this.checkTeamPermission(accountId, teamId);
        await this.prismaService.$transaction(async (prisma) => {
            const memberInvitaion = await prisma.teamMemberInvitation.findUnique({
                where: {
                    id: inviteId,
                    isActive: true,
                },
            });
            if (memberInvitaion.invitationStatus === InvitationStatus.REQUESTED) {
                await prisma.teamMemberInvitation.update({
                    where: {
                        id: inviteId,
                    },
                    data: {
                        isActive: false,
                        updatedAt: new Date(),
                    },
                });
            } else {
                throw new NotFoundException(`The invitation has been accepted by other team member`);
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
        if (applications) throw new ConflictException(`Cannot delete team because some team's contracts are active`);
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.team.update({
                where: {
                    id: teamId,
                    isActive: true,
                },
                data: {
                    isActive: true,
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
            await prisma.teamMemberInvitation.updateMany({
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
                invitationStatus: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: Prisma.SortOrder.desc,
            },
            ...QueryPagingHelper.queryPaging(query),
        };
        const invitations = (await this.prismaService.teamMemberInvitation.findMany(search)).map((invitation) => {
            return {
                id: invitation.id,
                teamId: invitation.teamId,
                memberId: invitation.memberId,
                teamName: invitation.team.name,
                leaderName: invitation.team.leader.name,
                contact: invitation.team.leader.contact,
                invitationDate: invitation.updatedAt ? invitation.updatedAt : invitation.createdAt,
                introduction: invitation.team.introduction,
                invitationStatus: invitation.invitationStatus,
            };
        });
        const invitaionListCount = await this.prismaService.teamMemberInvitation.count({
            where: search.where,
        });
        return new PaginationResponse(invitations, new PageInfo(invitaionListCount));
    }

    async updateInvitationStatus(accountId: number, inviteId: number, body: TeamMemberUpdateInvitationStatus): Promise<void> {
        const teamInvitation = await this.prismaService.teamMemberInvitation.findUnique({
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
                invitationStatus: true,
            },
        });
        if (!teamInvitation) throw new NotFoundException(`The invitation is not exist`);
        if (teamInvitation.invitationStatus !== InvitationStatus.REQUESTED)
            throw new ConflictException(`The invitation had been accept or reject`);
        if (body.status === InvitationStatus.DECLIENED) {
            await this.prismaService.teamMemberInvitation.update({
                where: {
                    id: inviteId,
                },
                data: {
                    invitationStatus: InvitationStatus.DECLIENED,
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
                await prisma.teamMemberInvitation.update({
                    where: {
                        id: inviteId,
                        isActive: true,
                    },
                    data: {
                        invitationStatus: InvitationStatus.ACCEPTED,
                        updatedAt: new Date(),
                    },
                });
            });
        }
    }
}
