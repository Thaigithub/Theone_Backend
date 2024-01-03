import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Banner } from './banner-admin-banner.dto';

export class PostBanner extends Banner {
    @Expose()
    @IsNumber()
    postId: number;
}
