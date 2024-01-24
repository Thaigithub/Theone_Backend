import { Inquiry } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

class Inquirer {
    type: Inquiry['inquirerType'];
    name: string;
    contact: string;
}

export class InquiryAdminGetDetailResponse {
    id: Inquiry['id'];
    createdAt: Inquiry['createdAt'];
    inquirer: Inquirer;
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
