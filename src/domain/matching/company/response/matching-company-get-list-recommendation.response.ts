import { RequestObject } from '@prisma/client';
import { MatchingCompanyGetItemRecommendationMemberDetail } from './matching-company-get-item-recommendation-member-detail.response';
import { MatchingCompanyGetItemRecommendationTeamDetail } from './matching-company-get-item-recommendation-team-detail.response';

export class MatchingCompanyGetItemRecommendation {
    id: number;
    object: RequestObject;
    name: string;
    contact: string;
    totalMonths: number;
    totalYears: number;
    specialNote: string[];
    numberOfTeamMembers: number;
    memberDetail: MatchingCompanyGetItemRecommendationMemberDetail;
    teamDetail: MatchingCompanyGetItemRecommendationTeamDetail;
}
export class MatchingCompanyGetListRecommendation {
    data: MatchingCompanyGetItemRecommendation[];
}
