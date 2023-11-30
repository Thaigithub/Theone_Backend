import { TeamDTO } from 'application/dtos/team.dto';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { GetTeamDetailsResponse } from 'presentation/responses/admin-team.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';

export interface TeamUseCase {
  searchTeams(request: TeamSearchRequest): Promise<PaginationResponse<TeamDTO>>;
  getTeamDetail(id: number): Promise<GetTeamDetailsResponse>;
}
export const TeamUseCase = Symbol('TeamUseCase');
