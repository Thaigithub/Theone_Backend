import { Banner, CompanyPostBanner, File, Site, SiteBanner } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
class FileClass {
    key: File['key'];
    fileName: File['fileName'];
    type: File['type'];
    size: File['size'];
}
class SiteBannerResponse {
    id: Banner['id'];
    siteName: Site['name'];
    title: SiteBanner['title'];
    bannerFile: FileClass;
    status: Banner['status'];
    requestDate: CompanyPostBanner['requestDate'];
    acceptDate: CompanyPostBanner['acceptDate'];
    priority: CompanyPostBanner['priority'];
}

export class AdminBannerGetSiteResponse extends PaginationResponse<SiteBannerResponse> {}
