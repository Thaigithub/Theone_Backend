import { ApiProperty } from '@nestjs/swagger';
import { Banner, BannerStatus, CompanyPostBanner, Site, SiteBanner } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class SiteBannerResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: String })
    title: SiteBanner['title'];
    @ApiProperty({ type: FileResponse })
    bannerFile: FileResponse;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    bannerStatus: Banner['status'];
    @ApiProperty({ type: Date })
    requestDate: CompanyPostBanner['requestDate'];
    @ApiProperty({ type: Date })
    acceptDate: CompanyPostBanner['acceptDate'];
    @ApiProperty({ type: Number })
    priority: CompanyPostBanner['priority'];
    requestStatus: SiteBanner['status'];
}

export class BannerAdminGetSiteResponse extends PaginationResponse<SiteBannerResponse> {}
