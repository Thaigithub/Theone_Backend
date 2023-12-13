import { ApiProperty } from '@nestjs/swagger';
import { BannerStatus, Company, CompanyPostBanner, Post, PostBanner, RequestBannerStatus, Site } from '@prisma/client';
import { FileClass } from '../dto/banner-admin-filetype.response.dto';

export class AdminBannerGetDetailCompanyJobPostResponse {
    @ApiProperty({ type: FileClass })
    bannerFile: FileClass;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: BannerStatus;
    @ApiProperty({ type: Number })
    postId: PostBanner['postId'];
    @ApiProperty({ type: String })
    postName: Post['name'];
    @ApiProperty({ type: Number })
    siteId: Site['id'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: Number })
    companyId: Company['id'];
    @ApiProperty({ type: String })
    companyName: Company['name'];
    @ApiProperty({ type: String })
    presentativeName: Company['presentativeName'];
    @ApiProperty({ type: Date })
    desiredStartDate: CompanyPostBanner['desiredStartDate'];
    @ApiProperty({ type: Date })
    desiredEndDate: CompanyPostBanner['desiredEndDate'];
    @ApiProperty({ type: Date })
    requestDate: CompanyPostBanner['requestDate'];
    @ApiProperty({ type: Date })
    acceptDate: CompanyPostBanner['acceptDate'];
    @ApiProperty({ type: 'enum', enum: RequestBannerStatus })
    requestBannerStatus: RequestBannerStatus;
}
