import { CurrencyExchangeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointMemberExchangePointResponse {
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    exchangeStatus: CurrencyExchangeStatus;
}

export class PointMemberGetExchangePointListResponse extends PaginationResponse<PointMemberExchangePointResponse> {}
