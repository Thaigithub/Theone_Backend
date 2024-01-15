import { CompanyType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SearchCategory } from '../dto/company-admin-search-category.dto.request.dto';
export class AdminCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(CompanyType)
    @IsOptional()
    type: CompanyType;

    @Expose()
    @IsOptional()
    @IsEnum(SearchCategory)
    searchCategory: SearchCategory;

    @Expose()
    @IsOptional()
    @IsString()
    searchKeyword: string;
}
