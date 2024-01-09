import { BannerStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { BannerAdminBannerSearchCategory } from '../enum/banner-admin-banner-search-category.enum';

export class BannerAdminGetGeneralRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsEnum(BannerStatus)
    @IsOptional()
    status: BannerStatus;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsOptional()
    @IsEnum(BannerAdminBannerSearchCategory)
    category: BannerAdminBannerSearchCategory;
}
