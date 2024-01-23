import { Term } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class TermResponse {
    id: Term['id'];
    title: Term['title'];
    content: Term['content'];
}

export class TermMemberGetListResponse extends PaginationResponse<TermResponse> {}
