import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { GetTeamDetailsResponse, GetTeamMemberDetails } from '../admin/response/admin-team.response';
import { MemberCreateTeamRequest, MemberUpdateTeamRequest } from './request/member-upsert-team.request';
import { TeamMemberApplyPost } from './request/team-member-apply-post.request';
import { MemberTeamsResponse } from './response/member-teams.response';

@Injectable()
export class MemberTeamService {
    constructor(private readonly prismaService: PrismaService) {}
    async saveTeam(accountId: number, request: MemberCreateTeamRequest): Promise<void> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: accountId,
            },
        });
        if (!member) {
            throw new NotFoundException(`Member with accountId ${accountId} not found`);
        }
        try {
            await this.prismaService.$transaction(async (prisma) => {
                await prisma.team.create({
                    data: {
                        name: request.teamName,
                        leaderId: member.id,
                        introduction: request.introduction,
                    },
                });
            });
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
    async getTeams(accountId: number): Promise<MemberTeamsResponse[]> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: accountId,
            },
        });
        if (!member) {
            throw new NotFoundException(`Member with accountId ${accountId} not found`);
        }
        const teams = await this.prismaService.team.findMany({
            where: {
                leaderId: member.id,
            },
            include: {
                leader: true,
            },
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
                    members: team.totalMembers,
                    createdAt: team.createdAt,
                }) as MemberTeamsResponse,
        );
        return result;
    }
    async getTeamDetails(id: number): Promise<GetTeamDetailsResponse> {
        const team = await this.prismaService.team.findUniqueOrThrow({
            where: {
                id,
            },
            select: {
                code: true,
                name: true,
            },
        });
        if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
        }
        const members = await this.prismaService.membersOnTeams.findMany({
            where: {
                teamId: id,
            },
            select: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                        account: {
                            select: {
                                username: true,
                                status: true,
                            },
                        },
                        contact: true,
                    },
                },
            },
        });
        return {
            teamName: team.name,
            teamCode: team.code,
            members: members.map(
                (memberInfo) =>
                    ({
                        id: memberInfo.member.id,
                        userName: memberInfo.member.account.username,
                        name: memberInfo.member.name,
                        level: memberInfo.member.level,
                        contact: memberInfo.member.contact,
                        memberStatus: memberInfo.member.account.status,
                    }) as GetTeamMemberDetails,
            ),
        };
    }
    async update(accountId: number, request: MemberUpdateTeamRequest): Promise<void> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId,
            },
        });
        if (!member) {
            throw new NotFoundException(`Member with accountId ${accountId} not found`);
        }
        const team = this.prismaService.team.findFirst({
            where: {
                id: request.id,
                leaderId: member.id,
            },
        });
        if (!team) {
            throw new BadRequestException('You do not have permission to update this team');
        }
        try {
            await this.prismaService.team.update({
                where: {
                    id: request.id,
                    leaderId: member.id,
                },
                data: {
                    name: request.teamName,
                    introduction: request.introduction,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async addApplyPost(accountId: number, payload: TeamMemberApplyPost) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
            },
            include: {
                member: true,
            },
        });

        //Check account belong to the team
        const team = await this.prismaService.team.findUnique({
            where: {
                id: payload.teamId,
                isActive: true,
            },
            include: {
                members: true,
                leader: true,
            },
        });

        if (!team) {
            throw new BadRequestException('Team does not exist');
        }

        if (!team.members.map((member) => member.memberId).includes(account.member.id) && team.leaderId !== account.member.id) {
            throw new BadRequestException('You are not belong to the team');
        }

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
                    teamId: team.id,
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
}
