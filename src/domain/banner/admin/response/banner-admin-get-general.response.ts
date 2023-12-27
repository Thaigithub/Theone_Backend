import { ApiProperty } from '@nestjs/swagger';
import { Banner, BannerStatus, GeneralBanner } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { FileClass } from '../dto/banner-admin-filetype.response.dto';

export class GeneralBannerResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: String })
    title: GeneralBanner['title'];
    @ApiProperty({ type: String })
    urlLink: GeneralBanner['urlLink'];
    @ApiProperty({ type: Number })
    priority: GeneralBanner['priority'];
    @ApiProperty({ type: FileClass })
    bannerFile: FileClass;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: Banner['status'];
    @ApiProperty({ type: Date })
    startDate: GeneralBanner['startDate'];
    @ApiProperty({ type: Date })
    endDate: GeneralBanner['endDate'];
    @ApiProperty({ type: Date })
    regDate: GeneralBanner['regDate'];
}

export class AdminBannerGetGeneralResponse extends PaginationResponse<GeneralBannerResponse> {}
