import { Banner, CompanyAdvertisingBanner } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class SiteBannerResponse {
    id: Banner['id'];
    title: CompanyAdvertisingBanner['title'];
    bannerFile: FileResponse;
    bannerStatus: Banner['status'];
    requestDate: CompanyAdvertisingBanner['requestDate'];
    acceptDate: CompanyAdvertisingBanner['acceptDate'];
    priority: CompanyAdvertisingBanner['priority'];
    requestStatus: CompanyAdvertisingBanner['status'];
}

export class BannerAdminGetListCompanyAdvertisingResponse extends PaginationResponse<SiteBannerResponse> {}
