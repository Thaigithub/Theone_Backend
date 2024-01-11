import { Banner, BannerStatus, CompanyPostBanner, Post, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class CompanyJobPostBannerResponse {
    id: Banner['id'];
    siteName: Site['name'];
    postName: Post['name'];
    postId: Post['id'];
    bannerFile: FileResponse;
    bannerStatus: BannerStatus;
    requestDate: CompanyPostBanner['requestDate'];
    acceptDate: CompanyPostBanner['acceptDate'];
    requestStatus: CompanyPostBanner['status'];
    priority: CompanyPostBanner['priority'];
}

export class BannerAdminGetListCompanyJobPostResponse extends PaginationResponse<CompanyJobPostBannerResponse> {}
