import { Term, TermVersion } from '@prisma/client';

export class TermAdminGetDetailResponse {
    id: TermVersion['id'];
    title: Term['title'];
    content: TermVersion['content'];
    revisionDate: TermVersion['revisionDate'];
}
