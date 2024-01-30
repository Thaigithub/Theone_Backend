import { PointStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
class PointMemberResponse {
    id: number;
    createdAt: Date;
    completeAt: Date;
    reason: string;
    amount: number;
    status: PointStatus;
}

export class PointMemberGetListResponse extends PaginationResponse<PointMemberResponse> {}
