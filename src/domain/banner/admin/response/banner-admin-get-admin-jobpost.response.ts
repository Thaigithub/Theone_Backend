import { ApiProperty } from '@nestjs/swagger';
import { AdminPostBanner, Banner, BannerStatus, Post } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class AdminJobPostBannerResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: Number })
    postId: Post['id'];
    @ApiProperty({ type: FileResponse })
    bannerFile: FileResponse;
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

export class BannerAdminGetAdminJobPostResponse extends PaginationResponse<AdminJobPostBannerResponse> {}
