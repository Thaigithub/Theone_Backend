import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PointAdminSearchCategoryFilter, PointAdminSortCategoryFilter } from '../dto/point-admin-filter';

export class PointAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(PointAdminSortCategoryFilter)
    @IsOptional()
    pointHeld: PointAdminSortCategoryFilter;

    @Expose()
    @IsEnum(PointAdminSearchCategoryFilter)
    @IsOptional()
    searchCategory: PointAdminSearchCategoryFilter;

    @Expose()
    @IsString()
    @IsOptional()
    searchTerm: string;
}
