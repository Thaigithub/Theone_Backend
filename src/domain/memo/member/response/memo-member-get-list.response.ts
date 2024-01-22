import { Memo } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class GetListResponse {
    id: Memo['id'];
    startDate: Date;
    endDate: Date;
    note: string;
}
export class MemoMemberGetListResponse extends PaginationResponse<GetListResponse> {}
