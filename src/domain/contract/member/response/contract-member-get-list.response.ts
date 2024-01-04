import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ContractStatus } from '../enum/contract-member-status.enum';
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
    codeNameGeneral: string;
    codeNameSpecial: string;
    isInterested: boolean;
    status: ContractStatus;
}
export class ContractMemberGetListResponse extends PaginationResponse<GetListResponse> {}
