import { PointStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class MemberAdminGetPointDetailResponse {
    completeDate: Date;
    reason: string;
    amount: number;
    remainAmount: number;
    status: PointStatus;
}

export class MemberAdminGetPointDetailListResponse extends PaginationResponse<MemberAdminGetPointDetailResponse> {}
