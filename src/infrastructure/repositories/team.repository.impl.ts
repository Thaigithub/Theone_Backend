import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository.impl';
import { Prisma, Team, TeamStatus } from '@prisma/client';
import { TeamRepository } from 'domain/repositories/team.repository';
import { PrismaService } from 'infrastructure/services/prisma.service';
import { PrismaModel } from 'domain/entities/prisma.model';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { TeamDTO } from 'application/dtos/team.dto';
import { SearchCategoryForSearch, SortOptionForSearch, TeamStatusForSearch } from 'domain/enums/team-search';
import { PageInfo, Pagination } from 'presentation/responses/pageInfo.response';

@Injectable()
export class TeamRepositoryImpl extends BaseRepositoryImpl<Team> implements TeamRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.TEAM);
  }
  async searchTeamFilter(request: TeamSearchRequest): Promise<Pagination<TeamDTO>> {
    const { keyWord, pageNumber, pageSize, searchCategory, sortOptions, teamStatus } = request;
    const where: Prisma.TeamWhereInput = {};
    if (teamStatus !== TeamStatusForSearch.DEFAULT) {
      where.status = teamStatus as TeamStatus;
    }
    const unifiedKeyword = keyWord.toLowerCase();
    if (keyWord) {
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
            { leader: { name: { contains: unifiedKeyword } } }
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
        orderBy = { createdAt: 'asc' }; // Default sorting
        break;
    }
    const teams = await this.prismaService.team.findMany({
      where,
      orderBy,
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      include: {
        members: true,
        leader: true,
      },
    });

    const teamsDto = teams.map(team => {
      const teamSize = team.members.length;
      const leaderName = team.leader.name;
      const leaderContact = team.leader.contact;
      return TeamDTO.from(team, leaderName, leaderContact, teamSize);
    });
    const pageInfo: PageInfo = {
      total: teams.length,
    };
    const result: Pagination<TeamDTO> = {
      data: teamsDto,
      pageInfo: pageInfo,
    };
    return result;
  }
}
