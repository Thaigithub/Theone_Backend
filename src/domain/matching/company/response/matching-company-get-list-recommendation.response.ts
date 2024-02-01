import { RequestObject } from '@prisma/client';

class MatchingCompanyGetItemRecommendation {
    id: number;
    object: RequestObject;
    name: string;
    contact: string;
    totalMonths: number;
    totalYears: number;
    numberOfTeamMembers: number;
    memberDetail: {
        localInformation: string;
        totalYears: number;
        totalMonths: number;
        entire: string;
        occupations: string[];
    };
    teamDetail: {
        name: string;
        leader: {
            name: string;
            contact: string;
            totalYears: number;
            totalMonths: number;
            occupations: string[];
        };
        totalYears: number;
        totalMonths: number;
        region: string;
        occupation: string;
        member: {
            rank: string;
            name: string;
            contact: string;
            totalYears: number;
            totalMonths: number;
            workingStatus: string;
            occupations: string[];
        };
    };
}
export class MatchingCompanyGetListRecommendation {
    data: MatchingCompanyGetItemRecommendation[];
}
