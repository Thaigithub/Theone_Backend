import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository.impl';
import { Prisma, TeamStatus } from '@prisma/client';
import { TeamRepository } from 'domain/repositories/team.repository';
import { PrismaService } from 'infrastructure/services/prisma.service';
import { PrismaModel } from 'domain/entities/prisma.model';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { SearchCategoryForSearch, SortOptionForSearch, TeamStatusForSearch } from 'domain/enums/team-search';
import { GetAdminTeamResponse, GetTeamDetailsResponse, GetTeamMemberDetails } from 'presentation/responses/admin-team.response';
@Injectable()
export class TeamRepositoryImpl extends BaseRepositoryImpl<any> implements TeamRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.TEAM);
  }
  async getTeamWithIds(ids: number[]): Promise<GetAdminTeamResponse[]> {
    const teams = this.prismaService.team.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        leader: true,
        members: true,
      },
    });
    const result = (await teams).map(
      team =>
        ({
          id: team.id,
          code: team.code,
          name: team.name,
          leaderName: team.leader.name,
          leaderContact: team.leader.contact,
          members: team.members.length,
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
        memberInfo =>
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
  async searchTeamFilter(request: TeamSearchRequest): Promise<any> {
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
        members: true,
        leader: true,
      },
    });
    return teams;
  }
}
