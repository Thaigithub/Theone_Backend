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
        codeName: string[];
        localInformation: string;
        totalYears: number;
        totalMonths: number;
        entire: string;
        occupations: string[];
    };
    teamDetail: {
        codeName: string;
        leaderName: string;
        leaderContact: string;
        leaderAddress: string;
        totalYears: number;
        totalMonths: number;
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
