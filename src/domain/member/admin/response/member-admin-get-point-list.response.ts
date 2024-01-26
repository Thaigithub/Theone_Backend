import { PaginationResponse } from 'utils/generics/pagination.response';

export class MemberAdminGetPointResponse {
    memberId: number;
    name: string;
    contact: string;
    pointHeld: number;
    totalExchanngePoint: number;
}

export class MemberAdminGetPointListResponse extends PaginationResponse<MemberAdminGetPointResponse> {}
