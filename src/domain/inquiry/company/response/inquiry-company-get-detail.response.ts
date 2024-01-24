import { Inquiry } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class InquiryCompanyGetDetailResponse {
    id: Inquiry['id'];
    createdAt: Inquiry['createdAt'];
    inquiryType: Inquiry['inquiryType'];
    status: Inquiry['status'];
    questionTitle: Inquiry['questionTitle'];
    questionContent: Inquiry['questionContent'];
    questionFiles: FileResponse[];
    asnweredAt: Inquiry['answeredAt'];
    answerTitle: Inquiry['answerTitle'];
    answerContent: Inquiry['answerContent'];
    answerFiles: FileResponse[];
}
