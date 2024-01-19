import { Post, PostStatus, PostType } from '@prisma/client';

export class PostCompanyGetItemListSiteResponse {
    name: string;
}
export class PostCompanyGetItemListResponse {
    name: string;
    type: PostType;
    status: PostStatus;
    startDate: Post['startDate'];
    endDate: Post['endDate'];
    site: PostCompanyGetItemListSiteResponse;
    view: number;
}
