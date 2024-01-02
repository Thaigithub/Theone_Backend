import { ApiProperty } from '@nestjs/swagger';
import { Banner, BannerStatus, CompanyPostBanner, Post, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class CompanyJobPostBannerResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: Number })
    postId: Post['id'];
    @ApiProperty({ type: FileResponse })
    bannerFile: FileResponse;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: Banner['status'];
    @ApiProperty({ type: Date })
    requestDate: CompanyPostBanner['requestDate'];
    @ApiProperty({ type: Date })
    acceptDate: CompanyPostBanner['acceptDate'];
    @ApiProperty({ type: Number })
    priority: CompanyPostBanner['priority'];
}

export class AdminBannerGetCompanyJobPostResponse extends PaginationResponse<CompanyJobPostBannerResponse> {}
