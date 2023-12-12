import { Banner, CompanyPostBanner, File, Post, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
class FileClass {
    key: File['key'];
    fileName: File['fileName'];
    type: File['type'];
    size: File['size'];
}
class CompanyJobPostBannerResponse {
    id: Banner['id'];
    siteName: Site['name'];
    postName: Post['name'];
    postId: Post['id'];
    bannerFile: FileClass;
    status: Banner['status'];
    requestDate: CompanyPostBanner['requestDate'];
    acceptDate: CompanyPostBanner['acceptDate'];
    priority: CompanyPostBanner['priority'];
}

export class AdminBannerGetCompanyJobPostResponse extends PaginationResponse<CompanyJobPostBannerResponse> {}
