import { Report } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class ReportResponse {
    id: Report['id'];
    title: Report['questionTitle'];
    createAt: Report['createdAt'];
    status: Report['status'];
}

export class ReportMemberGetListResponse extends PaginationResponse<ReportResponse> {}
