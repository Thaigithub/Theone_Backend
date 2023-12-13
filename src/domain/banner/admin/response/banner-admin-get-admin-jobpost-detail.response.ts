import { ApiProperty } from '@nestjs/swagger';
import { AdminPostBanner, Banner, BannerStatus, Post, PostBanner } from '@prisma/client';
import { FileClass } from '../dto/banner-admin-filetype.response.dto';

export class AdminBannerGetDetailAdminJobPostResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: FileClass })
    bannerFile: FileClass;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: BannerStatus;
    @ApiProperty({ type: Number })
    postId: PostBanner['postId'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: String })
    urlLink: AdminPostBanner['urlLink'];
    @ApiProperty({ type: Date })
    startDate: AdminPostBanner['startDate'];
    @ApiProperty({ type: Date })
    endDate: AdminPostBanner['endDate'];
    @ApiProperty({ type: Date })
    regDate: AdminPostBanner['regDate'];
}
