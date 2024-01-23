import { InquirerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { FaqAdminGetListSearchCategory } from '../enum/faq-admin-get-list-search-category.enum';

export class FaqAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(FaqAdminGetListSearchCategory)
    @IsOptional()
    searchCategory: FaqAdminGetListSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(InquirerType)
    @IsOptional()
    inquirerType: InquirerType;
}
