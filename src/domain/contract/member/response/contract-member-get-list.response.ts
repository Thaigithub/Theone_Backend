import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
export class GetListResponse {
    companyLogo: FileResponse;
    siteName: string;
    contractId: number;
    siteStartDate: Date;
    siteEndDate: Date;
    startDate: Date;
    endDate: Date;
}
export class ContractMemberGetListResponse extends PaginationResponse<GetListResponse> {}
