import { Company, Member, Site, Team, TeamEvaluation, TeamEvaluationByCompany } from '@prisma/client';

export class EvaluationAdminGetDetailTeamResponse {
    teamName: Team['name'];
    leaderName: Member['name'];
    totalMembers: Team['totalMembers'];
    totalEvaluators: TeamEvaluation['totalEvaluators'];
    averageScore: TeamEvaluation['averageScore'];
    listOfEvaluators: {
        companyName: Company['name'];
        siteName: Site['name'];
        siteContact: Site['contact'];
        personInCharge: Site['personInCharge'];
        score: TeamEvaluationByCompany['score'];
    }[];
}
