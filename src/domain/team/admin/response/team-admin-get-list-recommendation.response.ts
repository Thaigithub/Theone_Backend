import { Account, Code, Member, MemberEvaluation, MemberLevel, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class TeamAdminGetRecommendationResponse {
    id: Team['id'];
    name: Team['name'];
    leaderName: Member['name'];
    username: Account['username'];
    contact: Member['contact'];
    desiredOccupations: Code['name'];
    licenses: Code['name'][];
    averageScore: MemberEvaluation['averageScore'];
    isSuggest: boolean;
    leaderLevel: MemberLevel;
}

export class TeamAdminGetListRecommendationResponse extends PaginationResponse<TeamAdminGetRecommendationResponse> {}
