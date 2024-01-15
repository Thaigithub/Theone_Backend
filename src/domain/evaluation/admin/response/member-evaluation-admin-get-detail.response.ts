import { Company, Member, Site, TeamEvaluation, TeamEvaluationByCompany } from '@prisma/client';

export class MemberEvaluationAdminGetDetailResponse {
    name: Member['name'];
    contact: Member['contact'];
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
