import { Report } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class ReportMemberGetDetailResponse {
    id: Report['id'];
    questionTitle: Report['questionTitle'];
    questionContent: Report['questionContent'];
    questionFile: FileResponse;
    reportType: Report['reportType'];
    createAt: Report['createdAt'];
    status: Report['status'];
    answerTitle: Report['answerTitle'];
    answerContent: Report['answerContent'];
    answerFile: FileResponse;
    answeredAt: Report['answeredAt'];
}
