import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SearchCategory } from '../dto/product-admin-get-list-company.enum';

export class ProductAdminGetListCompanyRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SearchCategory)
    searchCategory: SearchCategory;

    @Expose()
    @IsString()
    keyword: string;
}
