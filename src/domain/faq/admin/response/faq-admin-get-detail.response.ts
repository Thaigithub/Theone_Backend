import { Faq } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class FaqAdminGetDetailResponse {
    id: Faq['id'];
    createdAt: Faq['createdAt'];
    inquirerType: Faq['inquirerType'];
    question: Faq['question'];
    answer: Faq['answer'];
    writer: Faq['writer'];
    category: Faq['category'];
    files: FileResponse[];
}
