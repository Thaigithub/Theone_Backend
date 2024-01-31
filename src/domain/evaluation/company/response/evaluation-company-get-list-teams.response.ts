import { Member, Site, Team, TeamEvaluationByCompany } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListTeamResponse {
    id: TeamEvaluationByCompany['id'];
    teamName: Team['name'];
    leaderName: Member['name'];
    leaderContact: Member['contact'];
    siteName: Site['name'];
    score: TeamEvaluationByCompany['score'];
}

export class EvaluationCompanyGetListTeamResponse extends PaginationResponse<GetListTeamResponse> {}
