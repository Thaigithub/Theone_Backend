import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointAdminListResponse {
    createAt: Date;
    reasonEarn: string;
    amount: number;
    remainAmount: number;
}

export class PointAdminGetListResponse extends PaginationResponse<PointAdminListResponse> {}
