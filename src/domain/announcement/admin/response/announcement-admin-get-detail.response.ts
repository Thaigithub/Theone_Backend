import { Admin, Announcement } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class AnnouncementAdminGetDetailResponse {
    title: Announcement['title'];
    content: Announcement['content'];
    name: Admin['name'];
    announcementFiles: {
        id: number;
        file: FileResponse;
    }[];
}
