import { ApiProperty } from '@nestjs/swagger';
import { AdminPostBanner, Banner, BannerStatus, Post } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { FileClass } from '../dto/banner-admin-filetype.response.dto';

export class AdminJobPostBannerResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: Number })
    postId: Post['id'];
    @ApiProperty({ type: FileClass })
    bannerFile: FileClass;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: Banner['status'];
    @ApiProperty({ type: String })
    startDate: AdminPostBanner['startDate'];
    @ApiProperty({ type: String })
    endDate: AdminPostBanner['endDate'];
    @ApiProperty({ type: String })
    regDate: AdminPostBanner['regDate'];
    @ApiProperty({ type: String })
    urlLink: AdminPostBanner['urlLink'];
    @ApiProperty({ type: Number })
    priority: AdminPostBanner['priority'];
}

export class AdminBannerGetAdminJobPostResponse extends PaginationResponse<AdminJobPostBannerResponse> {}
