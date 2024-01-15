import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostAdminApplicationSearchCategoryFilter } from '../enum/post-admin-application-search-category-filter.enum';
import { PostAdminApplicationSortCategory } from '../enum/post-admin-application-sort-category.enum';
import { PostAdminApplicationStatusFilter } from '../enum/post-admin-application-status-filter.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostAdminGetListForApplicationRequest extends PaginationRequest {
    @Expose()
    @IsEnum(PostAdminApplicationStatusFilter)
    @IsOptional()
    status: PostAdminApplicationStatusFilter;

    @Expose()
    @IsEnum(PostAdminApplicationSearchCategoryFilter)
    @IsOptional()
    searchCategory: PostAdminApplicationSearchCategoryFilter;

    @Expose()
    @IsEnum(PostAdminApplicationSortCategory)
    @IsOptional()
    sortByApplication: PostAdminApplicationSortCategory;

    @Expose()
    @IsString()
    @IsOptional()
    searchTerm: string;
}
