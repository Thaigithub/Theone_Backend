import { RequestBannerStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class BannerAdminChangeStatusRequestBannerRequest {
    @Expose()
    @IsEnum(RequestBannerStatus)
    status: RequestBannerStatus;

    @Expose()
    @IsString()
    @IsOptional()
    reason?: string;
}
