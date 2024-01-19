import { Admin, Announcement } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class AnnouncementAdminResponse {
    id: Announcement['id'];
    updatedAt: Announcement['updatedAt'];
    title: Announcement['title'];
    content: Announcement['content'];
    name: Admin['name'];
}

export class AnnouncementAdminGetListResponse extends PaginationResponse<AnnouncementAdminResponse> {}
