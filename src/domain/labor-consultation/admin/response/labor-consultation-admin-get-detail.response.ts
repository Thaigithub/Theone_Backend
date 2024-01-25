import { InquirerType, LaborConsultation } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

class Inquirer {
    type: InquirerType;
    name: string;
    contact: string;
}

export class LaborConsultationAdminGetDetailResponse {
    id: LaborConsultation['id'];
    createdAt: LaborConsultation['createdAt'];
    inquirer: Inquirer;
    status: LaborConsultation['status'];
    laborConsultationType: LaborConsultation['laborConsultationType'];
    questionTitle: LaborConsultation['questionTitle'];
    questionContent: LaborConsultation['questionContent'];
    questionFiles: FileResponse[];
    asnweredAt: LaborConsultation['answeredAt'];
    answerTitle: LaborConsultation['answerTitle'];
    answerContent: LaborConsultation['answerContent'];
    answerFiles: FileResponse[];
}
