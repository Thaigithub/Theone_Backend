import { Faq } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class FaqResponse {
    id: Faq['id'];
    createdAt: Faq['createdAt'];
    inquirerType: Faq['inquirerType'];
    question: Faq['question'];
    answer: Faq['answer'];
    writer: Faq['writer'];
    category: Faq['category'];
}

export class FaqAdminGetListResponse extends PaginationResponse<FaqResponse> {}
