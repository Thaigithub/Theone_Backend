import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TeamStatus } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SearchCategoryForSearch, SearchSortForSearch, TeamStatusForSearch } from './dto/team-search';
import { AdminTeamDownloadListRequest, AdminTeamDownloadRequest } from './request/team-admin-download.request';
import { AdminTeamGetListRequest } from './request/team-admin-get-list.request';
import { GetAdminTeamResponse, GetTeamDetailsResponse, GetTeamMemberDetails } from './response/admin-team.response';
@Injectable()
export class AdminTeamService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}
    getStatus(item: any) {
        if (!item.isActive) {
            return TeamStatusForSearch.DELETED;
        } else if (item.status == TeamStatus.STOPPED) {
            return TeamStatusForSearch.STOPPED;
        } else if (!item.exposureStatus) {
            return TeamStatusForSearch.NOT_EXPOSED;
        } else if (item.status == TeamStatus.WAITING_FOR_ACTIVITY) {
            return TeamStatusForSearch.WAITING_FOR_ACTIVITY;
        }
        return TeamStatusForSearch.GENERAL;
    }
    async getTeamWithIds(ids: number[]): Promise<GetAdminTeamResponse[]> {
        const teams = this.prismaService.team.findMany({
            where: {
                id: {
                    in: ids,
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
        });
        if (!teams) {
            throw new NotFoundException('No team was found');
        }
        const result = (await teams).map(
            (team) =>
                ({
                    id: team.id,
                    teamCode: team.teamCode,
                    name: team.name,
                    leaderName: team.leader.name,
                    leaderContact: team.leader.contact,
                    totalMembers: team.totalMembers,
                    status: this.getStatus(team),
                }) as GetAdminTeamResponse,
        );
        return result;
    }
    async getTeamDetail(id: number): Promise<GetTeamDetailsResponse> {
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
            members: members.map(
                (memberInfo) =>
                    ({
                        rank: memberInfo.member.id === team.leaderId ? 'TEAM LEADER' : 'TEAM MEMBER',
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
    async searchTeamFilter(query: AdminTeamGetListRequest): Promise<PaginationResponse<GetAdminTeamResponse>> {
        const queryFilter: Prisma.TeamWhereInput = {
            ...(query.teamStatus == TeamStatusForSearch.NOT_EXPOSED && {
                exposureStatus: false,
            }),
            ...(query.teamStatus && query.teamStatus != TeamStatusForSearch.DELETED && { isActive: true }),
            ...(query.teamStatus == TeamStatusForSearch.DELETED && { isActive: true }),
            ...(query.teamStatus == TeamStatusForSearch.GENERAL && { status: TeamStatus.GENERAL }),
            ...(query.teamStatus == TeamStatusForSearch.STOPPED && { status: TeamStatus.STOPPED }),
            ...(query.teamStatus == TeamStatusForSearch.WAITING_FOR_ACTIVITY && { status: TeamStatus.WAITING_FOR_ACTIVITY }),
            ...(!query.searchCategory && query.searchKeyword
                ? {
                      OR: [
                          { teamCode: { contains: query.searchKeyword, mode: 'insensitive' } },
                          { name: { contains: query.searchKeyword, mode: 'insensitive' } },
                          { leader: { name: { contains: query.searchKeyword, mode: 'insensitive' } } },
                      ],
                  }
                : {}),
            ...(query.searchCategory == SearchCategoryForSearch.TEAM_CODE && {
                teamCode: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
            ...(query.searchCategory == SearchCategoryForSearch.TEAM_NAME && {
                name: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
            ...(query.searchCategory == SearchCategoryForSearch.TEAM_LEADER && {
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
                ...(query.searchSort == SearchSortForSearch.LARGEST && { totalMembers: 'desc' }),
                ...(query.searchSort == SearchSortForSearch.SMALLEST && { totalMembers: 'asc' }),
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
    async downloadTeamDetails(teamId: number, response: Response, memberIds: string | string[]): Promise<void> {
        const memberlist = [];
        if (Array.isArray(memberIds)) {
            memberlist.push(...memberIds.map((item) => parseInt(item)));
        } else if (typeof memberIds === 'string') {
            memberlist.push(parseInt(memberIds));
        } else throw new BadRequestException('MemberIds required');
        const teamDetails = await this.getTeamDetail(teamId);
        if (teamDetails.members.length === 0) throw new NotFoundException('No members found');
        const excelData: Omit<GetTeamMemberDetails, 'id'>[] = teamDetails.members
            .filter((item) => memberlist.includes(item.id))
            .map(({ id, ...rest }) => rest);
        const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
    async download(query: AdminTeamDownloadListRequest | AdminTeamDownloadRequest, response: Response): Promise<void> {
        const list = [];
        if (Array.isArray(query)) {
            list.push(...query.map((item) => parseInt(item)));
        } else if (typeof query === 'string') {
            list.push(parseInt(query));
        }
        if (list.length === 0) throw new BadRequestException('Missing teamIds');
        const teams = await this.getTeamWithIds(list);
        const excelData: Omit<GetAdminTeamResponse, 'id'>[] = teams.map(({ id, ...rest }) => rest);
        const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
}
