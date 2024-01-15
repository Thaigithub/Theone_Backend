import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ProductAdminGetListSearchCategory } from '../dto/product-admin-get-list-company.enum';

export class ProductAdminGetListCompanyRequest extends PaginationRequest {
    @Expose()
    @IsEnum(ProductAdminGetListSearchCategory)
    @IsOptional()
    searchCategory: ProductAdminGetListSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
