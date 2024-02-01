import { Account, Code, Member, MemberEvaluation, MemberLevel } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class MemberAdminGetRecommendationResponse {
    id: Member['id'];
    name: Member['name'];
    username: Account['username'];
    contact: Member['contact'];
    desiredOccupations: Code['name'][];
    licenses: Code['name'][];
    averageScore: MemberEvaluation['averageScore'];
    isSuggest: boolean;
    level: MemberLevel;
}

export class MemberAdminGetListRecommendationResponse extends PaginationResponse<MemberAdminGetRecommendationResponse> {}
