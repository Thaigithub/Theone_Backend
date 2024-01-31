import { ProductType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class ProductAdminGetAmountRequest {
    @Expose()
    @IsOptional()
    @IsEnum(ProductType)
    productType: ProductType;
}
