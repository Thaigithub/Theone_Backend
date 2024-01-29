import { PointStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
class PointMemberResponse {
    createdAt: Date;
    reason: string;
    amount: number;
    status: PointStatus;
}

export class PointMemberGetListResponse extends PaginationResponse<PointMemberResponse> {}
