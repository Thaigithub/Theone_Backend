import { Company, Member, MemberEvaluation, MemberEvaluationByCompany, Site } from '@prisma/client';

export class EvaluationAdminGetDetailMemberResponse {
    name: Member['name'];
    contact: Member['contact'];
    totalEvaluators: MemberEvaluation['totalEvaluators'];
    averageScore: MemberEvaluation['averageScore'];
    listOfEvaluators: {
        companyName: Company['name'];
        siteName: Site['name'];
        siteContact: Site['contact'];
        personInCharge: Site['personInCharge'];
        score: MemberEvaluationByCompany['score'];
    }[];
}
