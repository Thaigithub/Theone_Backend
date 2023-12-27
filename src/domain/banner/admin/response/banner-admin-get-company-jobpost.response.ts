import { ApiProperty } from '@nestjs/swagger';
import { Banner, BannerStatus, CompanyPostBanner, Post, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { FileClass } from '../dto/banner-admin-filetype.response.dto';

class CompanyJobPostBannerResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: Number })
    postId: Post['id'];
    @ApiProperty({ type: FileClass })
    bannerFile: FileClass;
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
