import { AdminPostBanner, Banner, File, Post } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
class FileClass {
    key: File['key'];
    fileName: File['fileName'];
    type: File['type'];
    size: File['size'];
}
class AdminJobPostBannerResponse {
    id: Banner['id'];
    postName: Post['name'];
    postId: Post['id'];
    bannerFile: FileClass;
    status: Banner['status'];
    startDate: AdminPostBanner['startDate'];
    endDate: AdminPostBanner['endDate'];
    regDate: AdminPostBanner['regDate'];
    urlLink: AdminPostBanner['urlLink'];
    priority: AdminPostBanner['priority'];
}

export class AdminBannerGetAdminJobPostResponse extends PaginationResponse<AdminJobPostBannerResponse> {}
