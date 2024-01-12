import { AdvertisingBanner } from '@prisma/client';
import { BannerResponse } from '../dto/banner-admin-banner-response.dto';

class AdvertisingBannerType {
    title: AdvertisingBanner['title'];
    urlLink: AdvertisingBanner['urlLink'];
}

export class BannerAdminGetDetailAdvertisingResponse extends BannerResponse {
    advertisingBanner: AdvertisingBannerType;
}
