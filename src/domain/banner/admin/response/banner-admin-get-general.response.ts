import { ApiProperty } from '@nestjs/swagger';
import { Banner, BannerStatus, GeneralBanner } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GeneralBannerResponse {
    @ApiProperty({ type: Number })
    id: Banner['id'];
    @ApiProperty({ type: String })
    title: GeneralBanner['title'];
    @ApiProperty({ type: String })
    urlLink: GeneralBanner['urlLink'];
    @ApiProperty({ type: Number })
    priority: GeneralBanner['priority'];
    @ApiProperty({ type: FileResponse })
    bannerFile: FileResponse;
    @ApiProperty({ type: 'enum', enum: BannerStatus })
    status: Banner['status'];
    @ApiProperty({ type: Date })
    startDate: GeneralBanner['startDate'];
    @ApiProperty({ type: Date })
    endDate: GeneralBanner['endDate'];
    @ApiProperty({ type: Date })
    regDate: GeneralBanner['regDate'];
}

export class BannerAdminGetGeneralResponse extends PaginationResponse<GeneralBannerResponse> {}
