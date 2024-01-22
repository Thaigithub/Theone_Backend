import { RequestObject } from '@prisma/client';
import { SiteAdminGetDetailContractStatus } from '../enum/stie-admin-get-detail-contract-status.enum';

export class SiteAdminGetDetailContractResponse {
    siteName: string;
    startDate: string;
    endDate: string;
    manager: string;
    siteContact: string;
    siteEmail: string;
    contractors: {
        object: RequestObject;
        name: string;
        leaderName: string;
        contact: string;
        contractStartDate: string;
        contractEndDate: string;
        contractStatus: SiteAdminGetDetailContractStatus;
        key: string;
    }[];
}
