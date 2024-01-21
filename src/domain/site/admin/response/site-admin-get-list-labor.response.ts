import { PaginationResponse } from 'utils/generics/pagination.response';
import { SitePeriodStatus } from 'utils/get-site-status';

class GetListResponse {
    id: number;
    companyName: string;
    siteName: string;
    numberOfWorkers: number;
    status: SitePeriodStatus;
}

export class SiteAdminGetListLaborResponse extends PaginationResponse<GetListResponse> {}
