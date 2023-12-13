import { ApiProperty } from '@nestjs/swagger';
import { Banner, BannerStatus, Company, RequestBannerStatus, Site, SiteBanner } from '@prisma/client';
import { FileClass } from '../dto/banner-admin-filetype.response.dto';

export class AdminBannerGetDetailSiteResponse {
    @ApiProperty({ type: Number })
    siteId: Site['id'];
    @ApiProperty({ type: String })
    siteName: Site['name'];
    @ApiProperty({ type: Number })
    companyId: Company['id'];
    @ApiProperty({ type: String })
    companyName: Company['name'];
    @ApiProperty({ type: String })
    presentativeName: Company['name'];
    @ApiProperty({ type: FileClass })
    bannerFile: FileClass;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: Banner['status'];
    @ApiProperty({ type: 'enum', enum: RequestBannerStatus })
    requestBannerStatus: SiteBanner['status'];
    @ApiProperty({ type: Date })
    requestDate: SiteBanner['requestDate'];
    @ApiProperty({ type: Date })
    acceptDate: SiteBanner['acceptDate'];
    @ApiProperty({ type: Date })
    desiredStartDate: SiteBanner['desiredStartDate'];
    @ApiProperty({ type: Date })
    desiredEndDate: SiteBanner['desiredEndDate'];
}
