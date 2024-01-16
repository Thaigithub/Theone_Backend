import { ProductType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ProductCompanyTaxInvoiceType } from '../enum/product-company-tax-invoice-type.enum';

export class ProductCompanyGetPaymentHistoryListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsEnum(ProductType)
    @IsOptional()
    productType: ProductType;

    @Expose()
    @IsEnum(ProductCompanyTaxInvoiceType)
    @IsOptional()
    taxInvoiceType: ProductCompanyTaxInvoiceType;
}
