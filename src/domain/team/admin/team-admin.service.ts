import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TeamStatus } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TeamAdminGetListCategory } from './dto/team-admin-get-list-category.enum';
import { TeamAdminGetListSort } from './dto/team-admin-get-list-sort.enum';
import { TeamAdminGetListStatus } from './dto/team-admin-get-list-status.enum';
import { TeamAdminGetListRequest } from './request/team-admin-get-list.request';
import { TeamAdminGetDetailResponse } from './response/team-admin-get-detail.response';
import { TeamAdminGetListResponse } from './response/team-admin-get-list.response';
@Injectable()
export class TeamAdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}

    getStatus(item: any) {
        if (!item.isActive) {
            return TeamAdminGetListStatus.DELETED;
        } else if (item.status == TeamStatus.STOPPED) {
            return TeamAdminGetListStatus.STOPPED;
        } else if (!item.exposureStatus) {
            return TeamAdminGetListStatus.NOT_EXPOSED;
        } else if (item.status == TeamStatus.WAITING_FOR_ACTIVITY) {
            return TeamAdminGetListStatus.WAITING_FOR_ACTIVITY;
        }
        return TeamAdminGetListStatus.GENERAL;
    }

    async downloadDetail(teamId: number, response: Response, memberIds: string | string[]): Promise<void> {
        const memberlist = [];
        if (Array.isArray(memberIds)) {
            memberlist.push(...memberIds.map((item) => parseInt(item)));
        } else if (typeof memberIds === 'string') {
            memberlist.push(parseInt(memberIds));
        } else throw new BadRequestException('MemberIds required');
        const teamDetails = await this.getDetail(teamId);
        if (teamDetails.members.length === 0) throw new NotFoundException('No members found');
        const excelData = teamDetails.members
            .filter((item) => memberlist.includes(item.id))
            .map((member) => {
                delete member.id;
                return member;
            });
        const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }

    async getDetail(id: number): Promise<TeamAdminGetDetailResponse> {
        const team = await this.prismaService.team.findUniqueOrThrow({
            where: {
                id,
                isActive: true,
            },
            select: {
                leaderId: true,
                name: true,
                teamCode: true,
            },
        });
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
            teamCode: team.teamCode,
            members: members.map((memberInfo) => ({
                rank: memberInfo.member.id === team.leaderId ? 'TEAM LEADER' : 'TEAM MEMBER',
                id: memberInfo.member.id,
                userName: memberInfo.member.account.username,
                name: memberInfo.member.name,
                level: memberInfo.member.level,
                contact: memberInfo.member.contact,
                memberStatus: memberInfo.member.account.status,
            })),
        };
    }

    async getList(query: TeamAdminGetListRequest): Promise<TeamAdminGetListResponse> {
        const queryFilter: Prisma.TeamWhereInput = {
            ...(query.teamStatus == TeamAdminGetListStatus.NOT_EXPOSED && {
                exposureStatus: false,
            }),
            ...(query.teamStatus && query.teamStatus != TeamAdminGetListStatus.DELETED && { isActive: true }),
            ...(query.teamStatus == TeamAdminGetListStatus.DELETED && { isActive: true }),
            ...(query.teamStatus == TeamAdminGetListStatus.GENERAL && { status: TeamStatus.GENERAL }),
            ...(query.teamStatus == TeamAdminGetListStatus.STOPPED && { status: TeamStatus.STOPPED }),
            ...(query.teamStatus == TeamAdminGetListStatus.WAITING_FOR_ACTIVITY && { status: TeamStatus.WAITING_FOR_ACTIVITY }),
            ...(!query.searchCategory && query.searchKeyword
                ? {
                      OR: [
                          { teamCode: { contains: query.searchKeyword, mode: 'insensitive' } },
                          { name: { contains: query.searchKeyword, mode: 'insensitive' } },
                          { leader: { name: { contains: query.searchKeyword, mode: 'insensitive' } } },
                      ],
                  }
                : {}),
            ...(query.searchCategory == TeamAdminGetListCategory.TEAM_CODE && {
                teamCode: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
            ...(query.searchCategory == TeamAdminGetListCategory.TEAM_NAME && {
                name: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
            ...(query.searchCategory == TeamAdminGetListCategory.TEAM_LEADER && {
                leader: { name: { contains: query.searchKeyword, mode: 'insensitive' } },
            }),
        };

        const teamList = await this.prismaService.team.findMany({
            select: {
                id: true,
                name: true,
                teamCode: true,
                leader: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
                isActive: true,
                exposureStatus: true,
                totalMembers: true,
                status: true,
            },
            where: queryFilter,
            orderBy: {
                ...(query.searchSort == TeamAdminGetListSort.LARGEST && { totalMembers: 'desc' }),
                ...(query.searchSort == TeamAdminGetListSort.SMALLEST && { totalMembers: 'asc' }),
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const results = teamList.map((item) => {
            return {
                id: item.id,
                teamCode: item.teamCode,
                name: item.name,
                leaderName: item.leader.name,
                leaderContact: item.leader.contact,
                totalMembers: item.totalMembers,
                status: this.getStatus(item),
            };
        });
        const teamListCount = await this.prismaService.team.count({
            where: queryFilter,
        });
        return new PaginationResponse(results, new PageInfo(teamListCount));
    }

    async download(query: string | string[], response: Response): Promise<void> {
        const list = [];
        if (Array.isArray(query)) {
            list.push(...query.map((item) => parseInt(item)));
        } else if (typeof query === 'string') {
            list.push(parseInt(query));
        }
        if (list.length === 0) throw new BadRequestException('Missing teamIds');
        const teams = (
            await this.prismaService.team.findMany({
                where: {
                    id: {
                        in: list,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    teamCode: true,
                    leader: {
                        select: {
                            name: true,
                            contact: true,
                        },
                    },
                    isActive: true,
                    exposureStatus: true,
                    totalMembers: true,
                    status: true,
                },
            })
        ).map((team) => ({
            teamCode: team.teamCode,
            name: team.name,
            leaderName: team.leader.name,
            leaderContact: team.leader.contact,
            totalMembers: team.totalMembers,
            status: this.getStatus(team),
        }));
        if (teams.length === 0) throw new NotFoundException('Team not found');
        const excelStream = await this.excelService.createExcelFile(teams, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
}
