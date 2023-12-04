import { TeamDTO } from 'domain/team/dto/team.dto';
import { TeamSearchRequest } from 'domain/team/request/team.request';
import { GetTeamDetailsResponse } from 'domain/team/response/admin-team.response';
import { Response } from 'express';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
export interface TeamUseCase {
    searchTeams(request: TeamSearchRequest): Promise<PaginationResponse<TeamDTO>>;
    getTeamDetail(id: number): Promise<GetTeamDetailsResponse>;
    download(teamIds: number[], response: Response): Promise<void>;
    downloadTeamDetails(teamId: number, response: Response): Promise<void>;
}
export const TeamUseCase = Symbol('TeamUseCase');
