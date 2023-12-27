import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TeamStatus } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { SearchCategoryForSearch, SearchSortForSearch } from './dto/team-search';
import { AdminTeamDownloadListRequest, AdminTeamDownloadRequest } from './request/team-admin-download.request';
import { AdminTeamGetListRequest } from './request/team-admin-get-list.request';
import { GetAdminTeamResponse, GetTeamDetailsResponse, GetTeamMemberDetails } from './response/admin-team.response';
@Injectable()
export class AdminTeamService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}
    async getTeamWithIds(ids: number[]): Promise<GetAdminTeamResponse[]> {
        const teams = this.prismaService.team.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            include: {
                leader: true,
            },
        });
        if (!teams) {
            throw new NotFoundException('No team was found');
        }
        const result = (await teams).map(
            (team) =>
                ({
                    id: team.id,
                    code: team.code,
                    name: team.name,
                    leaderName: team.leader.name,
                    leaderContact: team.leader.contact,
                    members: team.totalMembers,
                    status: team.status,
                    isActive: team.isActive,
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
                code: true,
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
            teamCode: team.code,
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
    async searchTeamFilter(request: AdminTeamGetListRequest): Promise<PaginationResponse<GetAdminTeamResponse>> {
        const { searchKeyword, searchCategory, teamStatus } = request;
        const where: Prisma.TeamWhereInput = {};
        const orderBy = {};
        if (request.searchSort !== undefined) {
            if (request.searchSort === SearchSortForSearch.LARGEST) {
                orderBy['totalMembers'] = 'desc';
            } else {
                orderBy['totalMembers'] = 'asc';
            }
        }
        if (teamStatus !== undefined) {
            where.status = teamStatus as TeamStatus;
        }
        if (searchKeyword) {
            const unifiedsearchKeyword = searchKeyword.toLowerCase();
            if (searchCategory !== undefined) {
                switch (searchCategory) {
                    case SearchCategoryForSearch.TEAM_CODE:
                        where.code = { contains: unifiedsearchKeyword };
                        break;
                    case SearchCategoryForSearch.TEAM_NAME:
                        where.name = { contains: unifiedsearchKeyword };
                        break;
                    case SearchCategoryForSearch.TEAM_LEADER:
                        where.leader = { name: { contains: unifiedsearchKeyword } };
                        break;
                    default:
                        break;
                }
            } else {
                where.OR = [
                    { code: { contains: unifiedsearchKeyword } },
                    { name: { contains: unifiedsearchKeyword } },
                    { leader: { name: { contains: unifiedsearchKeyword } } },
                ];
            }
        }
        const teams = await this.prismaService.team.findMany({
            where,
            include: {
                leader: true,
            },
            orderBy,
            skip: request.pageNumber && (Number(request.pageNumber) - 1) * Number(request.pageSize),
            take: request.pageSize && Number(request.pageSize),
        });
        const total = await this.prismaService.team.count({
            where,
        });
        return {
            data: teams.map(
                (team) =>
                    ({
                        id: team.id,
                        name: team.name,
                        code: team.code,
                        isActive: team.isActive,
                        status: team.status,
                        leaderContact: team.leader.contact,
                        leaderName: team.leader.name,
                        members: team.totalMembers,
                    }) as GetAdminTeamResponse,
            ),
            pageInfo: {
                total: total,
            },
        };
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
        const excelData: Omit<GetAdminTeamResponse, 'id' | 'isActive'>[] = teams.map(({ id, isActive, ...rest }) => rest);
        const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
}
