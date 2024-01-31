import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TeamStatus } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { TeamAdminGetListCategory } from './enum/team-admin-get-list-category.enum';
import { TeamAdminGetListRecommendationCategory } from './enum/team-admin-get-list-recommendation-category.enum';
import { TeamAdminGetListRecommendationSort } from './enum/team-admin-get-list-recommendation-sort.enum';
import { TeamAdminGetListSort } from './enum/team-admin-get-list-sort.enum';
import { TeamAdminGetListStatus } from './enum/team-admin-get-list-status.enum';
import { TeamAdminGetListRecommendationRequest } from './request/team-admin-get-list-recommendation.request';
import { TeamAdminGetListRequest } from './request/team-admin-get-list.request';
import { TeamAdminGetDetailResponse } from './response/team-admin-get-detail.response';
import { TeamAdminGetListRecommendationResponse } from './response/team-admin-get-list-recommendation.response';
import { TeamAdminGetListResponse } from './response/team-admin-get-list.response';
@Injectable()
export class TeamAdminService {
    constructor(
        private prismaService: PrismaService,
        private excelService: ExcelService,
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

    async getListRecommendation(query: TeamAdminGetListRecommendationRequest): Promise<TeamAdminGetListRecommendationResponse> {
        const queryFilter: Prisma.TeamWhereInput = {
            isActive: true,
            ...(query.tier && { leader: { level: query.tier } }),
            ...(query.category === TeamAdminGetListRecommendationCategory.TEAM_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === TeamAdminGetListRecommendationCategory.TEAM_LEADER_NAME && {
                leader: { name: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === TeamAdminGetListRecommendationCategory.CONTACT && {
                leader: { contact: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === TeamAdminGetListRecommendationCategory.ID && {
                leader: { account: { username: { contains: query.keyword, mode: 'insensitive' } } },
            }),
            //TODO: Special, Qualification
        };

        const list = await this.prismaService.team.findMany({
            include: {
                leader: {
                    select: {
                        name: true,
                        contact: true,
                        licenses: {
                            where: {
                                isActive: true,
                            },
                            select: {
                                code: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        level: true,
                        account: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                teamEvaluation: {
                    select: {
                        averageScore: true,
                    },
                },
                code: {
                    select: {
                        name: true,
                    },
                },
                headhuntingRecommendations: {
                    include: {
                        headhunting: {
                            include: {
                                post: true,
                            },
                        },
                    },
                },
                members: {
                    where: {
                        isActive: true,
                    },
                    select: {
                        member: {
                            select: {
                                licenses: {
                                    select: {
                                        code: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                ...(query.sortScore === TeamAdminGetListRecommendationSort.HIGHEST_SCORE && {
                    leader: {
                        memberEvaluation: { averageScore: { sort: 'desc', nulls: 'last' } },
                    },
                }),
                ...(query.sortScore === TeamAdminGetListRecommendationSort.LOWEST_SCORE && {
                    leader: {
                        memberEvaluation: { averageScore: { sort: 'asc', nulls: 'last' } },
                    },
                }),
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.team.count({
            // Conditions based on request query
            where: queryFilter,
        });

        const headhuntingRequest = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id: query.requestId,
                isActive: true,
            },
            select: {
                headhunting: {
                    select: {
                        postId: true,
                    },
                },
            },
        });

        const responseList = list.map((item) => {
            let licenses = item.leader.licenses.map((item) => {
                return item.code.name;
            });

            item.members.forEach((member) => {
                const licenseList: string[] = member.member.licenses.map((license) => license.code.name);
                licenses = licenses.concat(licenseList);
            });
            return {
                id: item.id,
                name: item.name,
                leaderName: item.leader.name,
                username: item.leader.account.username,
                contact: item.leader.contact,
                desiredOccupations: item.code.name,
                licenses: licenses,
                averageScore: item.teamEvaluation ? item.teamEvaluation.averageScore : null,
                isSuggest:
                    headhuntingRequest && headhuntingRequest.headhunting.postId
                        ? item.headhuntingRecommendations
                              .map((recommend) => recommend.headhunting.postId)
                              .includes(headhuntingRequest.headhunting.postId)
                        : false,
            };
        });

        return new PaginationResponse(responseList, new PageInfo(listCount));
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
