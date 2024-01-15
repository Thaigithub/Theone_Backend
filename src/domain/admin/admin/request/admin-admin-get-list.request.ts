import { AdminLevel } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { AdminAdminSearchCategories } from '../enum/admin-admin-search-category.enum';

export class AdminAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(AdminLevel)
    @IsOptional()
    level: AdminLevel;

    @Expose()
    @IsEnum(AdminAdminSearchCategories)
    @IsOptional()
    category: AdminAdminSearchCategories;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
