import { CompanyType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { CompanyAdminGetListCategory } from '../enum/company-admin-get-list-category.enum';
export class CompanyAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(CompanyType)
    @IsOptional()
    type: CompanyType;

    @Expose()
    @IsOptional()
    @IsEnum(CompanyAdminGetListCategory)
    searchCategory: CompanyAdminGetListCategory;

    @Expose()
    @IsOptional()
    @IsString()
    searchKeyword: string;
}
