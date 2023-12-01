import { TeamDTO } from 'application/dtos/team.dto';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { GetTeamDetailsResponse } from 'presentation/responses/admin-team.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';
import { Response } from 'express';
export interface TeamUseCase {
  searchTeams(request: TeamSearchRequest): Promise<PaginationResponse<TeamDTO>>;
  getTeamDetail(id: number): Promise<GetTeamDetailsResponse>;
  download(teamIds: number[], response: Response): Promise<void>;
  downloadTeamDetails(teamId: number, response: Response): Promise<void>;
}
export const TeamUseCase = Symbol('TeamUseCase');
