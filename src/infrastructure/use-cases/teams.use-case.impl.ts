import { Inject, Injectable } from '@nestjs/common';
import { TeamDTO } from 'application/dtos/team.dto';
import { TeamUseCase } from 'application/use-cases/team.use-case';
import { TeamRepository } from 'domain/repositories/team.repository';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { Pagination } from 'presentation/responses/pageInfo.response';

@Injectable()
export class TeamUseCaseImpl implements TeamUseCase {
  constructor(@Inject(TeamRepository) private readonly teamRepository: TeamRepository) {}
    searchTeams(request: TeamSearchRequest): Promise<Pagination<TeamDTO>> {
        return this.teamRepository.searchTeamFilter(request)
    }

}
