import { Company, Site, SiteEvaluation } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListSiteResponse {
    id: SiteEvaluation['id'];
    companyName: Company['name'];
    siteName: Site['name'];
    totalEvaluators: SiteEvaluation['totalEvaluators'];
    averageScore: SiteEvaluation['averageScore'];
}

export class EvaluationAdminGetListSiteResponse extends PaginationResponse<GetListSiteResponse> {}
