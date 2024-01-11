import { AdminPostBanner, Banner, BannerStatus, Post } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerAdminGetDetailAdminJobPostResponse {
    id: Banner['id'];
    bannerFile: FileResponse;
    status: BannerStatus;
    postId: AdminPostBanner['postId'];
    postName: Post['name'];
    urlLink: AdminPostBanner['urlLink'];
    startDate: AdminPostBanner['startDate'];
    endDate: AdminPostBanner['endDate'];
    regDate: AdminPostBanner['regDate'];
}
