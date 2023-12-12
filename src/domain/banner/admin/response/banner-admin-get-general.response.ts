import { Banner, File, GeneralBanner } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
class FileClass {
    key: File['key'];
    fileName: File['fileName'];
    type: File['type'];
    size: File['size'];
}
class GeneralBannerResponse {
    id: Banner['id'];
    title: GeneralBanner['title'];
    urlLink: GeneralBanner['urlLink'];
    priority: GeneralBanner['priority'];
    bannerFile: FileClass;
    status: Banner['status'];
    startDate: Date;
    endDate: Date;
    regDate: Date;
}

export class AdminBannerGetGeneralResponse extends PaginationResponse<GeneralBannerResponse> {}
