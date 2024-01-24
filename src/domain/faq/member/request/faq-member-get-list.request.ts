import { FaqCategory } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class FaqMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(FaqCategory)
    @IsOptional()
    category: FaqCategory;
}
