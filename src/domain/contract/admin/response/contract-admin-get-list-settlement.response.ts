import { Contract, Member, RequestObject, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListSettlementResponse {
    type: RequestObject;
    name: Member['name'] | Team['name'];
    contact: Member['contact'];
    requestDate: Contract['settlementRequestDate'];
    status: Contract['settlementStatus'];
    completeDate: Contract['settlementCompleteDate'];
}
export class ContractAdminGetListSettlementResponse extends PaginationResponse<GetListSettlementResponse> {}
