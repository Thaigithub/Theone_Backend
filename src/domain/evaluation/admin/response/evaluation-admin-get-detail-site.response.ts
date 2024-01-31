import { Account, Company, Member, Site, SiteEvaluation, SiteEvaluationByContract } from '@prisma/client';

export class EvaluationAdminGetDetailSiteResponse {
    companyName: Company['name'];
    siteName: Site['name'];
    address: Site['address'];
    contact: Site['contact'];
    personInCharge: Site['personInCharge'];
    totalEvaluators: SiteEvaluation['totalEvaluators'];
    averageScore: SiteEvaluation['averageScore'];
    listOfEvaluators: {
        name: Member['name'];
        username: Account['username'];
        contact: Member['contact'];
        score: SiteEvaluationByContract['score'];
    }[];
}
