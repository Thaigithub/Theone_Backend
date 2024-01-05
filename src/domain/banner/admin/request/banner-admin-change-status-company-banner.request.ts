import { ApiProperty } from '@nestjs/swagger';
import { RequestBannerStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class BannerAdminChangeStatusCompanyBannerRequest {
    @Expose()
    @ApiProperty({ type: 'enum', enum: RequestBannerStatus })
    @IsEnum(RequestBannerStatus)
    status: RequestBannerStatus;
}
