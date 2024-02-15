import { Term, TermVersion } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class TermResponse {
    id: TermVersion['id'];
    title: Term['title'];
    content: TermVersion['content'];
    revisionDate: TermVersion['revisionDate'];
}

export class TermMemberGetListResponse extends PaginationResponse<TermResponse> {}
