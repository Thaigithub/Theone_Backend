import { Term } from '@prisma/client';

export class TermAdminGetDetailResponse {
    id: Term['id'];
    title: Term['title'];
    content: Term['content'];
}
