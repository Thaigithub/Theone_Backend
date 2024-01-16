import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { CompanyAdminProductGetListSearchCategory } from '../enum/company-admin-product-get-list-.enum';

export class ComapnyAdminProductGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(CompanyAdminProductGetListSearchCategory)
    @IsOptional()
    searchCategory: CompanyAdminProductGetListSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
