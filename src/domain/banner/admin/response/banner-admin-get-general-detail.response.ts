import { ApiProperty } from '@nestjs/swagger';
import { BannerStatus, GeneralBanner } from '@prisma/client';
import { FileClass } from '../dto/banner-admin-filetype.response.dto';

export class AdminBannerGetDetailGeneralResponse {
    @ApiProperty({ type: FileClass })
    bannerFile: FileClass;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: BannerStatus;
    @ApiProperty({ type: String })
    title: GeneralBanner['title'];
    @ApiProperty({ type: String })
    urlLink: GeneralBanner['urlLink'];
    @ApiProperty({ type: Date })
    startDate: GeneralBanner['startDate'];
    @ApiProperty({ type: Date })
    endDate: GeneralBanner['endDate'];
    @ApiProperty({ type: Date })
    regDate: GeneralBanner['regDate'];
}
