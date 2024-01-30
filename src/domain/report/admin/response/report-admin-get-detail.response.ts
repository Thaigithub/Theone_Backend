import { Member, Report } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class ReportAdminGetDetailResponse {
    id: Report['id'];
    questionTitle: Report['questionTitle'];
    questionContent: Report['questionContent'];
    reportType: Report['reportType'];
    status: Report['status'];
    createAt: Report['createdAt'];
    questionFiles: FileResponse[];
    memberName: Member['name'];
    memberContact: Member['contact'];
}
