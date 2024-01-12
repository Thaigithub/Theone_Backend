import { Post, Site } from '@prisma/client';
import { BannerResponse } from '../dto/banner-admin-banner-response.dto';

class PostBannerType {
    postName: Post['name'];
    siteName: Site['name'] | null;
}

export class BannerAdminGetDetailPostResponse extends BannerResponse {
    postBanner: PostBannerType;
}
