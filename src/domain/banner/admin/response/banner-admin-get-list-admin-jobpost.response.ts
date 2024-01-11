import { AdminPostBanner, Banner, Post } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class AdminJobPostBannerResponse {
    id: Banner['id'];
    postName: Post['name'];
    postId: Post['id'];
    bannerFile: FileResponse;
    status: Banner['status'];
    startDate: AdminPostBanner['startDate'];
    endDate: AdminPostBanner['endDate'];
    regDate: AdminPostBanner['regDate'];
    priority: AdminPostBanner['priority'];
}

export class BannerAdminGetListAdminJobPostResponse extends PaginationResponse<AdminJobPostBannerResponse> {}
