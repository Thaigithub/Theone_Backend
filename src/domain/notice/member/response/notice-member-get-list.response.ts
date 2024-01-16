import { NoticeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class NoticeMemberGetResponse {
    id: number;
    createdAt: Date;
    title: string;
    content: string;
    status: NoticeStatus;
}

export class NoticeMemberGetListResponse extends PaginationResponse<NoticeMemberGetResponse> {}
