import { BannerStatus, Company, CompanyPostBanner, Post, RequestBannerStatus, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerAdminGetDetailCompanyJobPostResponse {
    bannerFile: FileResponse;
    bannerStatus: BannerStatus;
    postName: Post['name'];
    siteName: Site['name'];
    companyId: Company['id'];
    companyName: Company['name'];
    personInCharge: Site['personInCharge'];
    desiredStartDate: CompanyPostBanner['desiredStartDate'];
    desiredEndDate: CompanyPostBanner['desiredEndDate'];
    requestDate: CompanyPostBanner['requestDate'];
    acceptDate: CompanyPostBanner['acceptDate'];
    requestStatus: RequestBannerStatus;
    detail: CompanyPostBanner['detail'];
}
