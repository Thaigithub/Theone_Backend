import { ContractAdminGetDetailContractorResponse } from './contract-admin-get-detail-contractor.response';

export class ContractAdminGetDetailResponse {
    siteName: string;
    startDate: string;
    endDate: string;
    manager: string;
    siteContact: string;
    siteEmail: string;
    contractors: ContractAdminGetDetailContractorResponse[];
}
