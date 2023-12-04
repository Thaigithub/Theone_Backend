import { Injectable } from '@nestjs/common';
import { TeamSearchRequest } from 'domain/team/request/team.request';
import { GetAdminTeamResponse, GetTeamDetailsResponse } from 'domain/team/response/admin-team.response';
import { BaseRepository } from '../../helpers/entity/base.repository';

@Injectable()
export abstract class TeamRepository extends BaseRepository<any> {
    abstract searchTeamFilter(request: TeamSearchRequest): Promise<any>;
    abstract getTeamDetail(id: number): Promise<GetTeamDetailsResponse>;
    abstract getTeamWithIds(ids: number[]): Promise<GetAdminTeamResponse[]>;
}
