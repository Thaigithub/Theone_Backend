import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { TeamSearchRequest } from 'presentation/requests/team.request';
import { GetAdminTeamResponse, GetTeamDetailsResponse } from 'presentation/responses/admin-team.response';

@Injectable()
export abstract class TeamRepository extends BaseRepository<any> {
  abstract searchTeamFilter(request: TeamSearchRequest): Promise<any>;
  abstract getTeamDetail(id: number): Promise<GetTeamDetailsResponse>;
  abstract getTeamWithIds(ids: number[]): Promise<GetAdminTeamResponse[]>;
}
