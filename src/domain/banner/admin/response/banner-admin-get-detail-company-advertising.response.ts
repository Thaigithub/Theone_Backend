import { BannerStatus, Company, CompanyAdvertisingBanner } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerAdminGetDetailCompanyAdvertisingResponse {
    companyName: Company['name'];
    personInCharge: Company['contactName'];
    bannerFile: FileResponse;
    bannerStatus: BannerStatus;
    requestStatus: CompanyAdvertisingBanner['status'];
    requestDate: CompanyAdvertisingBanner['requestDate'];
    acceptDate: CompanyAdvertisingBanner['acceptDate'];
    desiredStartDate: CompanyAdvertisingBanner['desiredStartDate'];
    desiredEndDate: CompanyAdvertisingBanner['desiredEndDate'];
    title: CompanyAdvertisingBanner['title'];
    detail: CompanyAdvertisingBanner['detail'];
}
