import { AdminAdvertisingBanner, Banner, BannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class AdminAdvertisingBannerResponse {
    id: Banner['id'];
    title: AdminAdvertisingBanner['title'];
    urlLink: AdminAdvertisingBanner['urlLink'];
    priority: AdminAdvertisingBanner['priority'];
    bannerFile: FileResponse;
    status: BannerStatus;
    startDate: AdminAdvertisingBanner['startDate'];
    endDate: AdminAdvertisingBanner['endDate'];
    regDate: AdminAdvertisingBanner['regDate'];
}

export class BannerAdminGetListAdminAdvertisingResponse extends PaginationResponse<AdminAdvertisingBannerResponse> {}
