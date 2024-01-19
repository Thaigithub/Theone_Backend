import { CurrencyExchangeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { PointMemberStatus } from '../enum/point-member-request-status.enum';

class PointMemberExchangeResponse {
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    exchangeStatus: CurrencyExchangeStatus;
}

class PointMemberGetExchangeListResponse extends PaginationResponse<PointMemberExchangeResponse> {}

export class PointMemberExchangeGetListResponse {
    status: PointMemberStatus;
    data: PointMemberGetExchangeListResponse;
}
