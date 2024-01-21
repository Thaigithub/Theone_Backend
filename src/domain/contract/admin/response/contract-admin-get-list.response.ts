import { PaginationResponse } from 'utils/generics/pagination.response';
import { SitePeriodStatus } from 'utils/get-site-status';

export class ContractAdminGetItemResponse {
    id: number;
    companyName: string;
    siteName: string;
    numberOfContracts: number;
    status: SitePeriodStatus;
}

export class ContractAdminGetListResponse extends PaginationResponse<ContractAdminGetItemResponse> {}
