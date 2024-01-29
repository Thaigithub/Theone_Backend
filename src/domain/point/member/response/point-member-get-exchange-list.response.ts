import { PointStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class PointMemberExchangeResponse {
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    status: PointStatus;
}

export class PointMemberGetExchangeListResponse extends PaginationResponse<PointMemberExchangeResponse> {}
