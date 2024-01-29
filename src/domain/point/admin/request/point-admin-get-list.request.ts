import { PointStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PointAdminCategoryFilter } from '../enum/point-admin-category-filter';

export class PointAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(PointStatus)
    status: PointStatus;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsOptional()
    @IsEnum(PointAdminCategoryFilter)
    category: PointAdminCategoryFilter;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
