import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { BannerAdminAdvertisingSearchCategory } from '../enum/banner-admin-advertisng-search-category.enum';

export class BannerAdminGetListCompanyAdvertisingRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(BannerAdminAdvertisingSearchCategory)
    category: BannerAdminAdvertisingSearchCategory;

    @Expose()
    @IsOptional()
    @IsString()
    keyword: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    requestDate: string;
}
