import { Inject, Injectable } from '@nestjs/common';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamRepository } from 'domain/repositories/team.repository';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { Pagination } from 'presentation/responses/pageInfo.response';

@Injectable()
export class TeamUseCaseImpl implements TeamUseCase {
  constructor(@Inject(TeamRepository) private readonly teamRepository: TeamRepository) {}
  async searchTeams(request: TeamSearchRequest): Promise<Pagination<TeamDTO>> {
    const teams = await this.teamRepository.searchTeamFilter(request);
    const teamsDto = teams.map(team => {
      const teamSize = team.me;
      const leaderName = team.leader.name;
      const leaderContact = team.leader.contact;
      return TeamDTO.from(team, leaderName, leaderContact, teamSize);
    });
    return {
      data: teamsDto,
      pageInfo: { total: teams.length }
    };
  }
}
