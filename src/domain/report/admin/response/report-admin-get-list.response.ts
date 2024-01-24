import { Member, Report } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class ReportResponse {
    id: Report['id'];
    memberName: Member['name'];
    reportType: Report['reportType'];
    title: Report['questionTitle'];
    status: Report['status'];
    createAt: Report['createdAt'];
}

export class ReportAdminGetListResponse extends PaginationResponse<ReportResponse> {}
