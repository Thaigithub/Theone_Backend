import { Faq } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class FaqResponse {
    id: Faq['id'];
    createdAt: Faq['createdAt'];
    question: Faq['question'];
    answer: Faq['answer'];
    writer: Faq['writer'];
    category: Faq['category'];
    files: FileResponse[];
}

export class FaqMemberGetListResponse extends PaginationResponse<FaqResponse> {}
