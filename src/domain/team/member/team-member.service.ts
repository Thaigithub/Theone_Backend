import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InvitationStatus, Prisma, TeamStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { MemberCreateTeamRequest, MemberUpdateExposureStatusTeamRequest } from './request/member-upsert-team.request';
import { TeamGetMemberRequest } from './request/team-member-get-member.request';
import {
    GetTeamMemberDetail,
    GetTeamMemberInvitation,
    GetTeamsResponse,
    MemberResponse,
    TeamMemberDetailResponse,
    TeamsResponse,
} from './response/team-member-get.response';

@Injectable()
export class MemberTeamService {
    constructor(private readonly prismaService: PrismaService) {}

    getCurrentDateAsString(): string {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(0, 2);
        const month = currentDate.getMonth() < 10 ? '0' + currentDate.getMonth().toString() : currentDate.getMonth().toString();
        const day = currentDate.getDate() < 10 ? '0' + currentDate.getDate().toString() : currentDate.getDate().toString();

        return `${year}${month}${day}`;
    }

    isStringFiveDigitNumber(str: string): boolean {
        return /^\d{5}$/.test(str);
    }

    async checkExistMember(accountId: number) {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId,
                isActive: true,
            },
            select: {
                id: true,
            },
            // ...(selectOption || {}),
            // ...(includeOption || {}),
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

    async saveTeam(accountId: number, request: MemberCreateTeamRequest): Promise<void> {
        const member = await this.checkExistMember(accountId);
        if (!this.isStringFiveDigitNumber(request.sequenceDigit)) {
            throw new BadRequestException('Invalid sequence number');
        }
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
                            id: member.id,
                        },
                    },
                    introduction: request.introduction,
                    code: {
                        connect: {
                            id: request.codeId,
                        },
                    },
                    teamCode: this.getCurrentDateAsString() + request.sequenceDigit,
                    totalMembers: 1,
                },
            });
        });
    }

    async getTeams(accountId: number, query: PaginationRequest): Promise<GetTeamsResponse> {
        const member = await this.checkExistMember(accountId);
        const queryFilter: Prisma.TeamWhereInput = {
            OR: [
                {
                    leaderId: member.id,
                },
                {
                    members: {
                        some: {
                            memberId: member.id,
                            isActive: true,
                        },
                    },
                },
            ],
            isActive: true,
        };
        const teams = await this.prismaService.team.findMany({
            where: queryFilter,
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
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const result = teams.map(
            (team) =>
                ({
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
                            } as MemberResponse;
                        })
                        .concat({
                            id: team.leaderId,
                            name: team.leader.name,
                            contact: team.leader.contact,
                        } as MemberResponse),
                }) as TeamsResponse,
        );
        const teamListCount = await this.prismaService.team.count({
            where: queryFilter,
        });
        return new PaginationResponse(result, new PageInfo(teamListCount));
    }

    async getTeamDetails(accountId: number, id: number): Promise<TeamMemberDetailResponse> {
        /*
            Get from a team:
            - team name, activity area, team creation date, code, introduction
            Get from members of team:
            - leader name, leader contact
            - member name, member contact ...
            Get fromt team invitations:
            - member id, Invitation status, member name, member contact
         */
        const member = await this.checkExistMember(accountId);
        const queryFilter: Prisma.TeamWhereUniqueInput = {
            id: id,
            isActive: true,
            OR: [
                { leaderId: member.id },
                {
                    members: {
                        some: {
                            memberId: member.id,
                            isActive: true,
                        },
                    },
                },
            ],
        };
        const team = await this.prismaService.team.findUnique({
            where: queryFilter,
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
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
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
                .map(
                    (memberInfo) =>
                        ({
                            id: memberInfo.member.id,
                            name: memberInfo.member.name,
                            contact: memberInfo.member.contact,
                        }) as GetTeamMemberDetail,
                ),
            memberInvitations: memberInvitaions.map(
                (memberInfor) =>
                    ({
                        id: memberInfor.id,
                        memberId: memberInfor.member.id,
                        name: memberInfor.member.name,
                        contact: memberInfor.member.contact,
                        invitationStatus: memberInfor.invitationStatus,
                    }) as GetTeamMemberInvitation,
            ),
        };
    }

    async update(accountId: number, teamId: number, request: MemberCreateTeamRequest): Promise<void> {
        this.checkTeamPermission(accountId, teamId, true);
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

    async changeExposureStatus(accountId: number, teamId: number, payload: MemberUpdateExposureStatusTeamRequest) {
        const member = await this.checkTeamPermission(accountId, teamId, true);
        const team = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                leaderId: member.id,
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
                    leaderId: member.id,
                    isActive: true,
                },
                data: {
                    exposureStatus: payload.exposureStatus,
                },
            });
        } else {
            throw new HttpException(
                'The exposure status of the team in the database matches the provided exposure status',
                HttpStatus.OK,
            );
        }
    }

    async searchMember(query: TeamGetMemberRequest): Promise<GetTeamMemberDetail> {
        const member = await this.prismaService.member.findFirst({
            where: {
                name: query.username,
                contact: query.contact,
            },
            select: {
                id: true,
                name: true,
                contact: true,
            },
        });
        if (!member) {
            return {
                id: null,
                name: null,
                contact: null,
            };
        }
        return member;
    }

    async inviteMember(accountId: number, teamId: number, memberId: number) {
        /*
            @Param:
            accountId: the account of the member of the team
            teamId: id of the team
            memberId: id of the member that accountId want to invite to teamId
        */
        await this.checkTeamPermission(accountId, teamId, false);
        const member = await this.prismaService.member.findUnique({
            where: {
                id: memberId,
            },
        });
        if (!member) {
            throw new NotFoundException(`Member ${memberId} does not exist`);
        }
        const memberOnTeam = await this.prismaService.membersOnTeams.findUnique({
            where: {
                memberId_teamId: {
                    memberId: memberId,
                    teamId: teamId,
                },
                isActive: true,
            },
        });
        if (memberOnTeam) {
            throw new HttpException(`This member has already been joined the team id = ${teamId}`, HttpStatus.OK);
        }
        const team = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                isActive: true,
            },
            select: {
                leaderId: true,
            },
        });
        if (team && team.leaderId === memberId) {
            throw new HttpException(`This member has already been joined the team id = ${teamId}`, HttpStatus.OK);
        }
        const teamMemberInvitation = await this.prismaService.teamMemberInvitation.findFirst({
            where: {
                memberId: memberId,
                teamId: teamId,
                isActive: true,
            },
            select: {
                id: true,
                invitationStatus: true,
            },
        });
        if (teamMemberInvitation) {
            if (teamMemberInvitation.invitationStatus === InvitationStatus.REQUESTED) {
                throw new HttpException(`This member has already been invited and is waiting for acceptance`, HttpStatus.OK);
            } else if (teamMemberInvitation.invitationStatus === InvitationStatus.ACCEPTED) {
                throw new HttpException(`This member has already been accepted`, HttpStatus.OK);
            } else {
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
            const unActiveInvitation = await this.prismaService.teamMemberInvitation.findFirst({
                where: {
                    memberId: memberId,
                    teamId: teamId,
                },
                select: {
                    id: true,
                    invitationStatus: true,
                },
            });
            if (unActiveInvitation) {
                await this.prismaService.teamMemberInvitation.update({
                    where: {
                        id: unActiveInvitation.id,
                        memberId: memberId,
                        teamId: teamId,
                    },
                    data: {
                        isActive: true,
                        invitationStatus: InvitationStatus.REQUESTED,
                        updatedAt: new Date(),
                    },
                });
            } else {
                await this.prismaService.teamMemberInvitation.create({
                    data: {
                        isActive: true,
                        invitationStatus: InvitationStatus.REQUESTED,
                        member: {
                            connect: {
                                id: memberId,
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
    }

    async cancelInvitation(accountId: number, teamId: number, inviteId: number) {
        /*
        The accountId of team member can cancel the invitation that has been sent to the memberId.
        */
        await this.checkTeamPermission(accountId, teamId, false);
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
                        isActive: true,
                    },
                    data: {
                        isActive: false,
                        updatedAt: new Date(),
                    },
                });
            } else if (memberInvitaion.invitationStatus === InvitationStatus.ACCEPTED) {
                throw new NotFoundException(`The invitation has been accepted by other team member`);
            } else {
                throw new NotFoundException(`The invitation is not exist or has been rejected by other team member`);
            }
        });
    }

    async deleteTeam(accountId: number, teamId: number) {
        await this.checkTeamPermission(accountId, teamId, true);
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
        if (applications) {
            throw new ConflictException(`Cannot delete team because some team's contracts are active`);
        }
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
}
