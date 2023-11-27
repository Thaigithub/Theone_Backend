import { TeamDTO } from "application/dtos/team.dto";
import { TeamSearchRequest } from "presentation/requests/team.request";
import { Pagination } from "presentation/responses/pageInfo.response";

export interface TeamUseCase {
  searchTeams(request: TeamSearchRequest): Promise<Pagination<TeamDTO>>;
}
export const TeamUseCase = Symbol('AdminTeamUseCase');
