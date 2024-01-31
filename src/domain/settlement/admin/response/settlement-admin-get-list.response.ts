import { Member, RequestObject, Settlement, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class SettlementAdminGetResponse {
    id: Settlement['id'];
    object: RequestObject;
    name: Member['name'] | Team['name'];
    contact: Member['contact'];
    requestDate: Settlement['requestDate'];
    status: Settlement['status'];
    completeDate: Settlement['completeDate'];
}
export class SettlementAdminGetListResponse extends PaginationResponse<SettlementAdminGetResponse> {}
