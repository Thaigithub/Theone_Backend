import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ContractAdminGetItemResponse {
    id: number;
    companyName: string;
    siteName: string;
    numberOfContracts: number;
    status: SitePeriodStatus;
}

export class ContractAdminGetListResponse extends PaginationResponse<ContractAdminGetItemResponse> {}
