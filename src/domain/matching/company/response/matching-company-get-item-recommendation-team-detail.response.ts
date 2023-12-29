export class TeamMemberDetail {
    rank: string;
    name: string;
    contact: string;
    totalYears: number;
    totalMonths: number;
    occupation: string;
    workingStatus: string;
}

export class MatchingCompanyGetItemRecommendationTeamDetail {
    leaderName: string;
    leaderContact: string;
    leaderAddress: string;
    totalYears: number;
    totalMonths: number;
    member: TeamMemberDetail;
}
