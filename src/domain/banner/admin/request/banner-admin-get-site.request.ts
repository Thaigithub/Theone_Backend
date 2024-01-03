import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SiteSearchCaterory } from '../enum/banner-admin-site-search-category.enum';

export class AdminBannerGetSiteRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(SiteSearchCaterory)
    search: SiteSearchCaterory;

    @Expose()
    @IsOptional()
    @IsString()
    keyword: string;

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
}
