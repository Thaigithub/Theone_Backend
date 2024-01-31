import { Settlement } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class SettlementGetResponse {
    id: number;
    name: string;
    contact: string;
    settlementStatus: Settlement['status'];
    completeDate: Settlement['completeDate'];
}

export class SettlementCompanyGetListResponse extends PaginationResponse<SettlementGetResponse> {}
