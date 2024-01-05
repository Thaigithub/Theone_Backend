import { ApiProperty } from '@nestjs/swagger';
import { BannerStatus, Company, CompanyPostBanner, Post, PostBanner, RequestBannerStatus, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class BannerAdminGetDetailCompanyJobPostResponse {
    @ApiProperty({ type: FileResponse })
    bannerFile: FileResponse;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    bannerStatus: BannerStatus;
    @ApiProperty({ type: Number })
    postId: PostBanner['postId'];
    @ApiProperty({ type: String })
    postName: Post['name'];
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
    requestStatus: RequestBannerStatus;
}
