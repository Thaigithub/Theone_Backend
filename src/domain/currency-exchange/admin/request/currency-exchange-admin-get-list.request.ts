import { PointStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { CurrencyExchangeAdminSearchCategoryFilter } from '../dto/currency-exchange-admin-filter';

export class CurrencyExchangeAdminGetExchangeListRequest extends PaginationRequest {
    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsEnum(PointStatus)
    @IsOptional()
    status: PointStatus;

    @Expose()
    @IsOptional()
    @IsEnum(CurrencyExchangeAdminSearchCategoryFilter)
    category: CurrencyExchangeAdminSearchCategoryFilter;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
