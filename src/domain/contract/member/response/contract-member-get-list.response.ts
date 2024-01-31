import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ContractMemberGetListStatus } from '../enum/contract-member-get-list-status.enum';
export class GetListResponse {
    companyLogo: FileResponse;
    siteName: string;
    contractId: number;
    siteStartDate: Date;
    siteEndDate: Date;
    startDate: Date;
    endDate: Date;
    postId: number;
    postName: string;
    postEndDate: Date;
    siteAddress: string;
    occupation: string;
    isInterested: boolean;
    status: ContractMemberGetListStatus;
}
export class ContractMemberGetListResponse extends PaginationResponse<GetListResponse> {}
