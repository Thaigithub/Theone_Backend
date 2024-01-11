import { AdminAdvertisingBanner, BannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerAdminGetDetailAdminAdvertisingResponse {
    bannerFile: FileResponse;
    status: BannerStatus;
    title: AdminAdvertisingBanner['title'];
    urlLink: AdminAdvertisingBanner['urlLink'];
    startDate: AdminAdvertisingBanner['startDate'];
    endDate: AdminAdvertisingBanner['endDate'];
}
