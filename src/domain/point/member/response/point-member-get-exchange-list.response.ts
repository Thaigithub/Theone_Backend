import { CurrencyExchangeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class PointMemberExchangeResponse {
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    status: CurrencyExchangeStatus;
}

export class PointMemberGetExchangeListResponse extends PaginationResponse<PointMemberExchangeResponse> {}
