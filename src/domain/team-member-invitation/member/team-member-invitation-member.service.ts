import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InvitationStatus, TeamStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { GetTeamMemberInvitationGetListResponse } from './response/team-member-invitation-member-get-list.response';

@Injectable()
export class MemberTeamMemberInvitationService {
    constructor(private readonly prismaService: PrismaService) {}

    async checkExistMember(accountId: number) {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId,
                isActive: true,
            },
            select: {
                id: true,
            },
        });
        if (!member) {
            throw new NotFoundException(`Member with accountId ${accountId} not found`);
        }
        return member;
    }
    async checkTeamPermission(accountId: number, teamId: number, isTeamLeader: boolean) {
        const member = await this.checkExistMember(accountId);
        const team = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                ...(isTeamLeader && { leaderId: member.id }),
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
        return member;
    }

    async updatetotalMembers(teamId: number, value: number) {
        const team = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                isActive: true,
            },
            select: {
                totalMembers: true,
            },
        });
        if (!team && team.totalMembers + value < 0) {
            throw new InternalServerErrorException(`There is an error when calculate total number of members in team`);
        }
        await this.prismaService.team.update({
            where: {
                id: teamId,
                isActive: true,
            },
            data: {
                totalMembers: team.totalMembers + value,
            },
        });
    }

    async getInvitations(accountId: number, query: PaginationRequest): Promise<GetTeamMemberInvitationGetListResponse> {
        const member = await this.checkExistMember(accountId);
        const invitations = await this.prismaService.teamMemberInvitation.findMany({
            where: {
                memberId: member.id,
                isActive: true,
            },
            select: {
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
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const invitaionList = invitations.map((invitation) => {
            return {
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
            where: {
                memberId: member.id,
                isActive: true,
            },
        });
        return new PaginationResponse(invitaionList, new PageInfo(invitaionListCount));
    }

    async decline(accountId: number, inviteId: number) {
        const member = await this.checkExistMember(accountId);
        const teamInvitation = await this.prismaService.teamMemberInvitation.findUnique({
            where: {
                id: inviteId,
                isActive: true,
                team: {
                    isActive: true,
                },
            },
            select: {
                teamId: true,
                invitationStatus: true,
            },
        });
        if (!teamInvitation) {
            throw new NotFoundException(`The invitation is not exist`);
        }
        if (teamInvitation.invitationStatus === InvitationStatus.DECLIENED) {
            throw new HttpException(`The invitation had been declined`, HttpStatus.ACCEPTED);
        } else if (teamInvitation.invitationStatus === InvitationStatus.ACCEPTED) {
            throw new ConflictException(`The invitation had been accept`);
        }
        await this.prismaService.$transaction(async (prisma) => {
            const memberOnTeam = await prisma.membersOnTeams.findUnique({
                where: {
                    memberId_teamId: {
                        memberId: member.id,
                        teamId: teamInvitation.teamId,
                    },
                },
                select: {
                    isActive: true,
                },
            });
            if (memberOnTeam && memberOnTeam.isActive) {
                throw new ConflictException(`The member had been in the team`);
            }
            await prisma.teamMemberInvitation.update({
                where: {
                    id: inviteId,
                    isActive: true,
                },
                data: {
                    invitationStatus: InvitationStatus.DECLIENED,
                    updatedAt: new Date(),
                },
            });
        });
    }

    async accept(accountId: number, inviteId: number) {
        const member = await this.checkExistMember(accountId);
        await this.prismaService.$transaction(async (prisma) => {
            const teamInvitation = await prisma.teamMemberInvitation.findUnique({
                where: {
                    id: inviteId,
                    isActive: true,
                    team: {
                        isActive: true,
                    },
                    memberId: member.id,
                },
                select: {
                    teamId: true,
                    invitationStatus: true,
                },
            });
            if (!teamInvitation) {
                throw new NotFoundException(`The invitation is not exist`);
            }
            if (teamInvitation.invitationStatus === InvitationStatus.ACCEPTED) {
                throw new HttpException(`The invitation had been accept`, HttpStatus.ACCEPTED);
            } else if (teamInvitation.invitationStatus === InvitationStatus.DECLIENED) {
                throw new ConflictException(`The invitation had been declined`);
            } else {
                const memberOnTeam = await prisma.membersOnTeams.findUnique({
                    where: {
                        memberId_teamId: {
                            memberId: member.id,
                            teamId: teamInvitation.teamId,
                        },
                    },
                    select: {
                        isActive: true,
                    },
                });
                if (memberOnTeam && memberOnTeam.isActive) {
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
                    throw new HttpException(`The invitation had been accept`, HttpStatus.ACCEPTED);
                } else if (memberOnTeam && !memberOnTeam.isActive) {
                    await prisma.membersOnTeams.update({
                        where: {
                            memberId_teamId: {
                                memberId: member.id,
                                teamId: teamInvitation.teamId,
                            },
                        },
                        data: {
                            updatedAt: new Date(),
                            isActive: true,
                        },
                    });
                    await this.updatetotalMembers(teamInvitation.teamId, 1);
                } else {
                    await prisma.membersOnTeams.create({
                        data: {
                            memberId: member.id,
                            teamId: teamInvitation.teamId,
                            isActive: true,
                        },
                    });
                    await this.updatetotalMembers(teamInvitation.teamId, 1);
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
            }
        });
    }
}
