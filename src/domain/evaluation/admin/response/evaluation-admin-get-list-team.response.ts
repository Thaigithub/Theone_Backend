import { Member, Team, TeamEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListTeamResponse {
    id: TeamEvaluation['id'];
    teamName: Team['name'];
    leaderName: Member['name'];
    totalMembers: Team['totalMembers'];
    totalEvaluators: TeamEvaluation['totalEvaluators'];
    averageScore: TeamEvaluation['averageScore'];
}

export class EvaluationAdminGetListTeamResponse extends PaginationResponse<GetListTeamResponse> {}
