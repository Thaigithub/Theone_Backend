import { RequestBannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { BannerCompanyBannerType } from '../enum/banner-company-banner-type.enum';

class CompanyPostType {
    postName: string;
    siteName: string;
    desiredStartDate: Date;
    desiredEndDate: Date;
    detail: string;
    requestStatus: RequestBannerStatus;
}

class CompanyAdvertisingType {
    title: string;
    url: string;
    desiredStartDate: Date;
    desiredEndDate: Date;
    detail: string;
    requestStatus: RequestBannerStatus;
}

export class BannerCompanyGetDetailResponse {
    type: BannerCompanyBannerType;
    file: FileResponse;
    banner: CompanyPostType | CompanyAdvertisingType;
}
