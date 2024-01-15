import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointMemberPointResponse {
    createdAt: Date;
    reasonEarn: string;
    amount: number;
}

export class PointMemberGetPointListResponse extends PaginationResponse<PointMemberPointResponse> {}
