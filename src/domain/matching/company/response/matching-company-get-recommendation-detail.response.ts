import { MemberCompanyGetDetailResponse } from 'domain/member/company/response/member-company-get-detail.response';
import { TeamCompanyGetDetailResponse } from 'domain/team/company/response/team-company-get-detail.response';

export class MatchingCompanyGetRecommendationDetailResponse {
    member: MemberCompanyGetDetailResponse;
    team: TeamCompanyGetDetailResponse;
}
