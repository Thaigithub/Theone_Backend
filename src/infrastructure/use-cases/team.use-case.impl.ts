import { Inject, Injectable } from '@nestjs/common';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { PaginationValidationService } from 'common/utils/pagination-validator';
import { TeamRepository } from 'domain/repositories/team.repository';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { Pagination } from 'presentation/responses/pageInfo.response';

@Injectable()
export class TeamUseCaseImpl implements TeamUseCase {
  constructor(@Inject(TeamRepository) private readonly teamRepository: TeamRepository) {}
  async searchTeams(request: TeamSearchRequest): Promise<Pagination<TeamDTO>> {
    const teams = await this.teamRepository.searchTeamFilter(request);
    const teamsDto = teams.map(team => {
      const teamSize = team.members.length;
      const leaderName = team.leader.name;
      const leaderContact = team.leader.contact;
      return TeamDTO.from(team, leaderName, leaderContact, teamSize);
    });
    PaginationValidationService.validate(teamsDto, request.pageNumber, request.pageSize);
    const startIndex = (request.pageNumber - 1) * request.pageSize;
    const endIndex = startIndex + request.pageSize;
    const paginatedItems = teamsDto.slice(startIndex, endIndex);  
    return {
      data: paginatedItems,
      pageInfo: { total: teams.length },
    };
  }
}
