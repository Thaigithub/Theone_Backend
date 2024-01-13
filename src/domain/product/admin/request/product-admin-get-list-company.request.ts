import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SearchCategory } from '../dto/product-admin-get-list-company.enum';

export class ProductAdminGetListCompanyRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SearchCategory)
    @IsOptional()
    searchCategory: SearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
