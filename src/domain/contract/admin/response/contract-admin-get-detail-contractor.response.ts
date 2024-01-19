import { RequestObject } from '@prisma/client';
import { ContractStatus } from 'utils/enum/contract-status.enum';

export class ContractAdminGetDetailContractorResponse {
    object: RequestObject;
    name: string;
    leaderName: string;
    contact: string;
    contractStartDate: string;
    contractEndDate: string;
    contractStatus: ContractStatus;
    key: string;
}
