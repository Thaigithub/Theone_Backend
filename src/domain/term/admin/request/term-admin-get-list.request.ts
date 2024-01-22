import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { TermAdminGetListSearchCategory } from '../enum/term-admin-get-list-search-category.enum';

export class TermAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(TermAdminGetListSearchCategory)
    @IsOptional()
    searchCategory: TermAdminGetListSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
