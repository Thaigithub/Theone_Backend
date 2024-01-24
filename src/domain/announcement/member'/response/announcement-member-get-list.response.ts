import { Admin, Announcement } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class AnnouncementMemberResponse {
    id: Announcement['id'];
    createdAt: Announcement['createdAt'];
    title: Announcement['title'];
    content: Announcement['content'];
    name: Admin['name'];
    files: FileResponse[];
}

export class AnnouncementMemberGetListResponse extends PaginationResponse<AnnouncementMemberResponse> {}
