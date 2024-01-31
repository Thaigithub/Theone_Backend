import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { TermAdminGetListCategory } from '../enum/term-admin-get-list-category.enum';

export class TermAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(TermAdminGetListCategory)
    @IsOptional()
    searchCategory: TermAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
