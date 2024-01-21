import { RequestObject } from '@prisma/client';
import { ContractAdminStatus } from '../enum/contract-admin-status.enum';

export class ContractAdminGetDetailContractorResponse {
    object: RequestObject;
    name: string;
    leaderName: string;
    contact: string;
    contractStartDate: string;
    contractEndDate: string;
    contractStatus: ContractAdminStatus;
    key: string;
}
