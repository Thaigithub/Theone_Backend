import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointAdminResponse {
    memberId: number;
    name: string;
    contact: string;
    pointHeld: number;
    totalExchanngePoint: number;
}

export class PointAdminGetMemberListResponse extends PaginationResponse<PointAdminResponse> {}
