import { Expose } from 'class-transformer';
import { IsNotEmptyObject, IsNumber } from 'class-validator';
import { BannerRequest } from '../dto/banner-admin-banner-request.dto';

class PostBanner {
    @Expose()
    @IsNumber()
    postId: number;
}
export class BannerAdminUpsertPostRequest extends BannerRequest {
    @Expose()
    @IsNotEmptyObject()
    postBanner: PostBanner;
}
