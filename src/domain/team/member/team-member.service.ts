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
import { MemberCreateTeamRequest, MemberUpdateExposureStatusTeamRequest } from './request/member-upsert-team.request';
import { TeamMemberApplyPost } from './request/team-member-apply-post.request';
import { TeamGetMemberRequest } from './request/team-member-get-member.request';
import { GetInvitationsResponse } from './response/team-member-get-invitation-list.response';
import {
    GetTeamMemberDetail,
    GetTeamMemberInvitation,
    GetTeamsResponse,
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
        const teams = await this.prismaService.team.findMany({
            where: {
                leaderId: member.id,
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
                }) as TeamsResponse,
        );
        const teamListCount = await this.prismaService.team.count({
            where: {
                leaderId: member.id,
                isActive: true,
            },
        });
        return new PaginationResponse(result, new PageInfo(teamListCount));
    }
    async getTeamDetails(id: number): Promise<TeamMemberDetailResponse> {
        /*
            Get from a team:
            - team name, activity area, team creation date, code, introduction
            Get from members of team:
            - leader name, leader contact
            - member name, member contact ...
            Get fromt team invitations:
            - member id, Invitation status, member name, member contact
         */
        const team = await this.prismaService.team.findUnique({
            where: {
                id,
                isActive: true,
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
                        id: memberInfor.member.id,
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

    async addApplyPost(accountId: number, payload: TeamMemberApplyPost) {
        await this.checkTeamPermission(accountId, payload.teamId, true);
        //Check exist post
        const post = await this.prismaService.post.findUnique({
            where: {
                id: payload.postId,
                isActive: true,
            },
        });

        if (!post) {
            throw new BadRequestException('Post does not exist');
        }

        //Check exist team - post
        const application = await this.prismaService.application.findUnique({
            where: {
                teamId_postId: {
                    teamId: payload.teamId,
                    postId: post.id,
                },
            },
        });
        if (application) {
            throw new BadRequestException('This job post is already applied');
        }

        await this.prismaService.application.create({
            data: {
                team: { connect: { id: payload.teamId } },
                post: { connect: { id: payload.postId } },
            },
        });
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

    async getInvitations(accountId: number, query: PaginationRequest): Promise<GetInvitationsResponse> {
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
        const teamMemberInvitation = await this.prismaService.teamMemberInvitation.findUnique({
            where: {
                memberId_teamId: {
                    memberId: memberId,
                    teamId: teamId,
                },
                isActive: true,
            },
            select: {
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
                        memberId_teamId: {
                            memberId: memberId,
                            teamId: teamId,
                        },
                        isActive: true,
                    },
                    data: {
                        invitationStatus: InvitationStatus.REQUESTED,
                        updatedAt: new Date(),
                    },
                });
            }
        } else {
            const unActiveInvitation = await this.prismaService.teamMemberInvitation.findUnique({
                where: {
                    memberId_teamId: {
                        memberId: memberId,
                        teamId: teamId,
                    },
                },
                select: {
                    invitationStatus: true,
                },
            });
            if (unActiveInvitation) {
                await this.prismaService.teamMemberInvitation.update({
                    where: {
                        memberId_teamId: {
                            memberId: memberId,
                            teamId: teamId,
                        },
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

    async cancelInvitation(accountId: number, teamId: number, memberId: number) {
        /*
        The accountId of team member can cancel the invitation that has been sent to the memberId.
        */
        await this.checkTeamPermission(accountId, teamId, false);
        await this.prismaService.$transaction(async (prisma) => {
            const memberInvitaion = await prisma.teamMemberInvitation.findUnique({
                where: {
                    memberId_teamId: {
                        memberId: memberId,
                        teamId: teamId,
                    },
                    isActive: true,
                },
            });
            if (memberInvitaion.invitationStatus === InvitationStatus.REQUESTED) {
                prisma.teamMemberInvitation.update({
                    where: {
                        memberId_teamId: {
                            memberId: memberId,
                            teamId: teamId,
                        },
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

    async acceptInvitation(accountId: number, teamId: number) {
        const member = await this.checkExistMember(accountId);
        const team = await this.prismaService.team.findUnique({
            where: {
                id: teamId,
                isActive: true,
            },
            select: {
                status: true,
            },
        });
        if (!team) {
            await this.prismaService.teamMemberInvitation.update({
                where: {
                    memberId_teamId: {
                        teamId: teamId,
                        memberId: member.id,
                    },
                    isActive: true,
                },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                },
            });
            throw new BadRequestException('The team is not exist');
        }
        if (team.status === TeamStatus.STOPPED) {
            throw new BadRequestException('The team had been forced to be stopped activity by administrator, try again later');
        }
        const teamInvitation = await this.prismaService.teamMemberInvitation.findUnique({
            where: {
                memberId_teamId: {
                    memberId: member.id,
                    teamId: teamId,
                },
                isActive: true,
                team: {
                    isActive: true,
                },
            },
            select: {
                invitationStatus: true,
            },
        });
        if (!teamInvitation) {
            throw new NotFoundException(`The invitation of team id = ${teamId} for member id= ${member.id}is not exist`);
        }
        if (teamInvitation.invitationStatus === InvitationStatus.DECLIENED) {
            throw new ConflictException(`The invitation had been declined`);
        } else if (teamInvitation.invitationStatus === InvitationStatus.ACCEPTED) {
            throw new HttpException(`The invitation had been accept`, HttpStatus.ACCEPTED);
        }

        this.prismaService.$transaction(async (prisma) => {
            //Update invitation status
            await prisma.teamMemberInvitation.update({
                where: {
                    memberId_teamId: {
                        memberId: member.id,
                        teamId: teamId,
                    },
                    isActive: true,
                    team: {
                        isActive: true,
                    },
                },
                data: {
                    invitationStatus: InvitationStatus.ACCEPTED,
                    updatedAt: new Date(),
                },
            });
            // Check exist record in membersOnTeam
            const existMember = await prisma.membersOnTeams.findUnique({
                where: {
                    memberId_teamId: {
                        memberId: member.id,
                        teamId: teamId,
                    },
                },
                select: {
                    isActive: true,
                },
            });
            // If have,
            if (existMember) {
                // Update member on team, the members in team will be automatically updated
                await prisma.membersOnTeams.update({
                    where: {
                        memberId_teamId: {
                            memberId: member.id,
                            teamId: teamId,
                        },
                    },
                    data: {
                        isActive: true,
                        updatedAt: new Date(),
                    },
                });
            } else {
                await prisma.membersOnTeams.create({
                    data: {
                        memberId: member.id,
                        teamId: teamId,
                    },
                });
            }
            await this.updatetotalMembers(teamId, 1);
        });
    }

    async declineInvitaion(accountId: number, teamId: number) {
        const member = await this.checkExistMember(accountId);
        const teamInvitation = await this.prismaService.teamMemberInvitation.findUnique({
            where: {
                memberId_teamId: {
                    memberId: member.id,
                    teamId: teamId,
                },
                isActive: true,
                team: {
                    isActive: true,
                },
            },
            select: {
                invitationStatus: true,
            },
        });
        if (!teamInvitation) {
            throw new NotFoundException(`The invitation of team id = ${teamId} is not exist`);
        }
        if (teamInvitation.invitationStatus === InvitationStatus.DECLIENED) {
            throw new HttpException(`The invitation had been declined`, HttpStatus.ACCEPTED);
        } else if (teamInvitation.invitationStatus === InvitationStatus.ACCEPTED) {
            throw new ConflictException(`The invitation had been accept`);
        }
        const memberOnTeam = await this.prismaService.membersOnTeams.findUnique({
            where: {
                memberId_teamId: {
                    memberId: member.id,
                    teamId: teamId,
                },
            },
            select: {
                isActive: true,
            },
        });
        if (memberOnTeam && memberOnTeam.isActive) {
            throw new ConflictException(`The member had been in the team`);
        }
        await this.prismaService.teamMemberInvitation.update({
            where: {
                memberId_teamId: {
                    memberId: member.id,
                    teamId: teamId,
                },
                isActive: true,
            },
            data: {
                invitationStatus: InvitationStatus.DECLIENED,
                updatedAt: new Date(),
            },
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
