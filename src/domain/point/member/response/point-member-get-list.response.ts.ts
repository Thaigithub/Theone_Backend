import { PaginationResponse } from 'utils/generics/pagination.response';
import { PointMemberStatus } from '../enum/point-member-request-status.enum';
class PointMemberResponse {
    createdAt: Date;
    reasonEarn: string;
    amount: number;
}

class PointMemberListResponse extends PaginationResponse<PointMemberResponse> {}

export class PointMemberGetListResponse {
    status: PointMemberStatus;
    data: PointMemberListResponse;
}
