import { ApiProperty } from '@nestjs/swagger';
import { BannerStatus, GeneralBanner } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class AdminBannerGetDetailGeneralResponse {
    @ApiProperty({ type: FileResponse })
    bannerFile: FileResponse;
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
