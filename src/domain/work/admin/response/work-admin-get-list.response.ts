import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class WorkAdminGetItemResponse {
    id: number;
    companyName: string;
    siteName: string;
    numberOfWorkers: number;
    status: SitePeriodStatus;
}

export class WorkAdminGetListResponse extends PaginationResponse<WorkAdminGetItemResponse> {}
