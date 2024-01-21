import { Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { TeamAdminGetListStatus } from '../dto/team-admin-get-list-status.enum';

class GetListResponse {
    id: number;
    teamCode: string;
    name: Team['name'];
    leaderName: string;
    leaderContact: string;
    totalMembers: number;
    status: TeamAdminGetListStatus;
}
export class TeamAdminGetListResponse extends PaginationResponse<GetListResponse> {}
