import { BannerStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { BannerAdminAdvertisingSearchCategory } from '../enum/banner-admin-advertisng-search-category.enum';

export class BannerAdminGetListPostRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsOptional()
    @IsDateString()
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
    @IsEnum(BannerAdminAdvertisingSearchCategory)
    category: BannerAdminAdvertisingSearchCategory;
}
