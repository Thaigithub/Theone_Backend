import { PaymentStatus, PaymentType, ProductType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class ProductAdminGetListSettlementRequest extends PaginationRequest {
    @IsEnum(ProductType)
    @IsOptional()
    @Expose()
    productType: ProductType;

    @IsEnum(PaymentType)
    @IsOptional()
    @Expose()
    paymentMethod: PaymentType;

    @IsEnum(PaymentStatus)
    @IsOptional()
    @Expose()
    paymentStatus: PaymentStatus;

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    @IsOptional()
    @Expose()
    startPaymentDate: string;

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    @IsOptional()
    @Expose()
    endPaymentDate: string;
}
