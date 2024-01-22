import { SettlementStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { ContractCompanyMember } from '../dto/contract-company-member.dto';
import { ContractCompanyTeam } from '../dto/contract-company-team.dto';

class GetListSettlementResponse {
    id: number;
    memberInfor: ContractCompanyMember;
    teamInfor: ContractCompanyTeam;
    settlementStatus: SettlementStatus;
    settlementCompleteDate: Date;
}

export class ContractCompanyGetListSettlementResponse extends PaginationResponse<GetListSettlementResponse> {}
