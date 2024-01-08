import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PostSearchCaterory } from '../enum/banner-admin-post-search-category.enum';

export class BannerAdminGetCompanyJobPostRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(PostSearchCaterory)
    searchCategory: PostSearchCaterory;

    @Expose()
    @IsOptional()
    @IsString()
    searchKeyword: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    requestDate: string;
}
