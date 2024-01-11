import { AdminPostBanner, Banner, BannerStatus, Post, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerAdminGetDetailAdminJobPostResponse {
    id: Banner['id'];
    bannerFile: FileResponse;
    status: BannerStatus;
    postName: Post['name'];
    siteName: Site['name'];
    startDate: AdminPostBanner['startDate'];
    endDate: AdminPostBanner['endDate'];
}
