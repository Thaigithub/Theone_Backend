import { InquirerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { FaqAdminGetListCategory } from '../enum/faq-admin-get-list-category.enum';

export class FaqAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(FaqAdminGetListCategory)
    @IsOptional()
    searchCategory: FaqAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(InquirerType)
    @IsOptional()
    inquirerType: InquirerType;
}
