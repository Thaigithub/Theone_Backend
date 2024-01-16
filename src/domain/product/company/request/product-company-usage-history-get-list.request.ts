import { ProductType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class ProductCompanyUsageHistoryGetListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    createdAt: string;

    @Expose()
    @IsEnum(ProductType)
    @IsOptional()
    productType: ProductType;
}
