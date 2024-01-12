import { Expose } from 'class-transformer';
import { IsNotEmptyObject, IsString, MaxLength } from 'class-validator';
import { BannerRequest } from '../dto/banner-admin-banner-request.dto';

class AdvertisingBanner {
    @Expose()
    @IsString()
    urlLink: string;

    @Expose()
    @IsString()
    @MaxLength(100)
    title: string;
}

export class BannerAdminUpsertAdvertisingRequest extends BannerRequest {
    @Expose()
    @IsNotEmptyObject()
    advertisingBanner: AdvertisingBanner;
}
