import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { TeamSearchRequest } from 'presentation/requests/team.request';

@Injectable()
export abstract class TeamRepository extends BaseRepository<any> {
  abstract searchTeamFilter(request: TeamSearchRequest): Promise<any>;
}
