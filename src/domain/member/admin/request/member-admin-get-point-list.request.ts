import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MemberAdminSearchCategoryFilter } from '../enum/member-admin-search-category.enum';
import { MemberAdminSortCategoryFilter } from '../enum/member-admin-sort-category.enum';

export class MemberAdminGetPointListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(MemberAdminSortCategoryFilter)
    @IsOptional()
    pointHeld: MemberAdminSortCategoryFilter;

    @Expose()
    @IsEnum(MemberAdminSearchCategoryFilter)
    @IsOptional()
    searchCategory: MemberAdminSearchCategoryFilter;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
