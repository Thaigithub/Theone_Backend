import { Notice } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CompanyGetNoticeResponse {
    id: Notice['id'];
    title: Notice['title'];
    content: Notice['content'];
    createdAt: Notice['createdAt'];
    updatedAt: Notice['updatedAt'];
    type: Notice['type'];
}

export class NoticeCompanyGetListResponse extends PaginationResponse<CompanyGetNoticeResponse> {}
