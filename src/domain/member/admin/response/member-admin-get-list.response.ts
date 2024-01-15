import { Account, Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MemberResponse {
    id: Member['id'];
    name: Member['name'];
    contact: Member['contact'];
    level: Member['level'];
    account: {
        username: Account['username'];
        status: Account['status'];
    };
}

export class MemberAdminGetListResponse extends PaginationResponse<MemberResponse> {}
