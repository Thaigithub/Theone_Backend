import { RequestBannerStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class BannerAdminChangeStatusCompanyBannerRequest {
    @Expose()
    @IsEnum(RequestBannerStatus)
    status: RequestBannerStatus;

    @Expose()
    @IsString()
    @IsOptional()
    reason: string;
}
