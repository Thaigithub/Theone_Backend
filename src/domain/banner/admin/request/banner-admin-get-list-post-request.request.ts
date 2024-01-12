import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { BannerAdminPostSearchCaterory } from '../enum/banner-admin-post-search-category.enum';

export class BannerAdminGetListPostRequestRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(BannerAdminPostSearchCaterory)
    category: BannerAdminPostSearchCaterory;

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
