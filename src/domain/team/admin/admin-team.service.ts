import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TeamStatus } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { SearchCategoryForSearch, SortOptionForSearch, TeamStatusForSearch } from './dto/team-search';
import { TeamSearchRequest } from './request/team.request';
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
            },
            select: {
                name: true,
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
    async searchTeamFilter(request: TeamSearchRequest): Promise<PaginationResponse<GetAdminTeamResponse>> {
        const { keyWord, searchCategory, sortOptions, teamStatus } = request;
        const where: Prisma.TeamWhereInput = {};
        if (teamStatus !== TeamStatusForSearch.DEFAULT) {
            where.status = teamStatus as TeamStatus;
        }
        if (keyWord) {
            const unifiedKeyword = keyWord.toLowerCase();
            if (searchCategory !== SearchCategoryForSearch.DEFAULT) {
                switch (searchCategory) {
                    case SearchCategoryForSearch.TEAM_CODE:
                        where.code = { contains: unifiedKeyword };
                        break;
                    case SearchCategoryForSearch.TEAM_NAME:
                        where.name = { contains: unifiedKeyword };
                        break;
                    case SearchCategoryForSearch.TEAM_LEADER:
                        where.leader = { name: { contains: unifiedKeyword } };
                        break;
                    default:
                        break;
                }
            } else {
                where.OR = [
                    { code: { contains: unifiedKeyword } },
                    { name: { contains: unifiedKeyword } },
                    { leader: { name: { contains: unifiedKeyword } } },
                ];
            }
        }
        let orderBy: Prisma.TeamOrderByWithRelationInput;
        switch (sortOptions) {
            case SortOptionForSearch.HIGHTEST_TEAM_MEMBERS:
                orderBy = { members: { _count: 'desc' } };
                break;
            case SortOptionForSearch.LOWEST_TEAM_MEMBERS:
                orderBy = { members: { _count: 'asc' } };
                break;
            default:
                orderBy = { createdAt: 'asc' };
                break;
        }
        const teams = await this.prismaService.team.findMany({
            where,
            orderBy,
            include: {
                leader: true,
            },
            skip: (Number(request.pageNumber) - 1) * Number(request.pageSize),
            take: Number(request.pageSize),
        });
        const total = await this.prismaService.team.count({
            where,
        });
        console.log(total);
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
    async downloadTeamDetails(teamId: number, response: Response): Promise<void> {
        const teamDetails = await this.getTeamDetail(teamId);
        const excelData: Omit<GetTeamMemberDetails, 'id'>[] = teamDetails.members.map(({ id, ...rest }) => rest);
        const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
    async download(teamIds: number[], response: Response): Promise<void> {
        const teams = await this.getTeamWithIds(teamIds);
        if (teams.length === 0) {
            throw new NotFoundException('No team founded');
        }
        const excelData: Omit<GetAdminTeamResponse, 'id' | 'isActive'>[] = teams.map(({ id, isActive, ...rest }) => rest);
        const excelStream = await this.excelService.createExcelFile(excelData, 'Teams');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
}
