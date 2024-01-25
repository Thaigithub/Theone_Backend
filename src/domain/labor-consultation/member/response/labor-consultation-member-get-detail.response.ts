import { LaborConsultation } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class LaborConsultationMemberGetDetailResponse {
    id: LaborConsultation['id'];
    createdAt: LaborConsultation['createdAt'];
    laborConsultationType: LaborConsultation['laborConsultationType'];
    status: LaborConsultation['status'];
    questionTitle: LaborConsultation['questionTitle'];
    questionContent: LaborConsultation['questionContent'];
    questionFiles: FileResponse[];
    asnweredAt: LaborConsultation['answeredAt'];
    answerTitle: LaborConsultation['answerTitle'];
    answerContent: LaborConsultation['answerContent'];
    answerFiles: FileResponse[];
}
