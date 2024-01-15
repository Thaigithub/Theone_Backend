import { PostType } from '@prisma/client';

export class PostAdminGetItemListResponse {
    type: PostType;
    name: string;
    siteName: string;
    sitePersonInCharge: string;
    siteContact: string;
    isHidden: boolean;
}
