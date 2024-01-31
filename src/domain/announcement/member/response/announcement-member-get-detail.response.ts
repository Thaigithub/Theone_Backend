import { Admin, Announcement } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class AnnouncementMemberGetDetailResponse {
    id: Announcement['id'];
    createdAt: Announcement['createdAt'];
    title: Announcement['title'];
    content: Announcement['content'];
    name: Admin['name'];
    files: FileResponse[];
}
