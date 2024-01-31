import { Member, Report } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class ReportAdminGetDetailResponse {
    id: Report['id'];
    questionTitle: Report['questionTitle'];
    questionContent: Report['questionContent'];
    questionFiles: FileResponse[];
    reportType: Report['reportType'];
    status: Report['status'];
    createAt: Report['createdAt'];
    memberName: Member['name'];
    memberContact: Member['contact'];
    answerTitle: Report['answerTitle'];
    answerContent: Report['answerContent'];
    answerFiles: FileResponse[];
    answeredAt: Report['answeredAt'];
}
