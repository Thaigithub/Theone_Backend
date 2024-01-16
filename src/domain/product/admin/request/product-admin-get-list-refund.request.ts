import { RefundStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ProductAdminRefundSearchCategory } from '../enum/product-admin-refund-search-category.enum';

export class ProductAdminGetListRefundRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(RefundStatus)
    status: RefundStatus;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsOptional()
    @IsEnum(ProductAdminRefundSearchCategory)
    category: ProductAdminRefundSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
