import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PostAdminPostStatusFilter } from '../enum/post-admin-post-status-filter.enum';
import { PostAdminPostTypeFilter } from '../enum/post-admin-post-type-filter.enum';
import { PostAdminSearchCategoryFilter } from '../enum/post-admin-search-category-filter.enum';

export class PostAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(PostAdminPostTypeFilter)
    @IsOptional()
    type: PostAdminPostTypeFilter;

    @Expose()
    @IsEnum(PostAdminPostStatusFilter)
    @IsOptional()
    status: PostAdminPostStatusFilter;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsEnum(PostAdminSearchCategoryFilter)
    @IsOptional()
    searchCategory: PostAdminSearchCategoryFilter;

    @Expose()
    @IsString()
    @IsOptional()
    searchTerm: string;
}
