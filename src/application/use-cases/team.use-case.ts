import { TeamDTO } from 'application/dtos/team.dto';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';

export interface TeamUseCase {
  searchTeams(request: TeamSearchRequest): Promise<PaginationResponse<TeamDTO>>;
}
export const TeamUseCase = Symbol('AdminTeamUseCase');
