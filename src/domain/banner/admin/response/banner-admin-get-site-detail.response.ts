import { Banner, Company, Site, SiteBanner } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerAdminGetDetailSiteResponse {
    siteId: Site['id'];
    siteName: Site['name'];
    companyId: Company['id'];
    companyName: Company['name'];
    personInCharge: Site['personInCharge'];
    bannerFile: FileResponse;
    bannerStatus: Banner['status'];
    requestStatus: SiteBanner['status'];
    requestDate: SiteBanner['requestDate'];
    acceptDate: SiteBanner['acceptDate'];
    desiredStartDate: SiteBanner['desiredStartDate'];
    desiredEndDate: SiteBanner['desiredEndDate'];
    title: SiteBanner['title'];
    detail: SiteBanner['detail'];
}
