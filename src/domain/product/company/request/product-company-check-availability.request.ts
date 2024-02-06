import { ProductType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class ProductCompanyCheckAvailabilityRequest {
    @Expose()
    @IsEnum(ProductType)
    productType: ProductType;
}
