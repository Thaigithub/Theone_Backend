import { RequestObject } from '@prisma/client';

export class MatchingCompanyGetItemRecommendation {
    id: number;
    object: RequestObject;
    name: string;
    contact: string;
    career: string;
    specialNote: string[];
    certificate: string[];
    numberOfTeamMembers: number;
}
export class MatchingCompanyGetListRecommendation {
    data: MatchingCompanyGetItemRecommendation[];
}
