import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { GetTeamDetailsResponse, GetTeamMemberDetails } from '../admin/response/admin-team.response';
import { MemberCreateTeamRequest, MemberUpdateTeamRequest } from './request/member-upsert-team.request';
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
                const file = await prisma.file.create({
                    data: {
                        type: request.fileType,
                        key: request.fileKey,
                        size: request.fileSize,
                        fileName: request.fileName,
                    },
                });

                await prisma.team.create({
                    data: {
                        fileId: file.id,
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
                    file: {
                        update: {
                            fileName: request.fileName,
                            type: request.fileType,
                            size: request.fileSize,
                        },
                    },
                },
                include: {
                    file: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
