import { Contract, Site, SiteEvaluationByContract } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListSiteResponse {
    id: SiteEvaluationByContract['id'];
    siteName: Site['name'];
    startWorkDate: Contract['startDate'];
    endWorkDate: Contract['endDate'];
    score: SiteEvaluationByContract['score'];
    logo: FileResponse;
}

export class EvaluationMemberGetListSiteResponse extends PaginationResponse<GetListSiteResponse> {}
