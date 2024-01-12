import { RequestBannerStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { BannerCompanyBannerType } from '../enum/banner-company-banner-type.enum';

class PostType {
    postName: string;
    siteName: string;
}

class AdvertisingType {
    title: string;
    urlLink: string;
}

export class BannerCompanyGetDetailRequestResponse {
    type: BannerCompanyBannerType;
    file: FileResponse;
    startDate: Date;
    endDate: Date;
    detail: string;
    requestStatus: RequestBannerStatus;
    banner: PostType | AdvertisingType;
}
