import { SettlementStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ContractCompanyGetMember, ContractCompanyGetTeam } from './contract-company-settlement-get-detail.response';

export class ContractCompanySettlementResponse {
    id: number;
    memberInfor: ContractCompanyGetMember;
    teamInfor: ContractCompanyGetTeam;
    settlementStatus: SettlementStatus;
    settlementCompleteDate: Date;
}

export class ContractCompanySettlementGetListResponse extends PaginationResponse<ContractCompanySettlementResponse> {}
