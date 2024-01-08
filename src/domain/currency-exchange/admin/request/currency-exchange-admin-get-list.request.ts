import { ApiProperty } from '@nestjs/swagger';
import { CurrencyExchangeStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { CurrencyExchangeAdminSearchCategoryFilter } from '../dto/currency-exchange-admin-filter';

export class CurrencyExchangeAdminGetExchangeListRequest extends PaginationRequest {
    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        type: 'string',
        required: false,
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        type: Date,
        required: false,
    })
    endDate: string;

    @Expose()
    @ApiProperty()
    @IsEnum(CurrencyExchangeStatus)
    @ApiProperty({ type: 'enum', enum: CurrencyExchangeStatus, required: false })
    @IsOptional()
    refundStatus: CurrencyExchangeStatus;

    @Expose()
    @ApiProperty()
    @IsOptional()
    @IsEnum(CurrencyExchangeAdminSearchCategoryFilter)
    @ApiProperty({
        type: 'enum',
        enum: CurrencyExchangeAdminSearchCategoryFilter,
        required: false,
    })
    searchCategory: CurrencyExchangeAdminSearchCategoryFilter;

    @Expose()
    @ApiProperty()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        example: 'Please enter your search term',
    })
    searchTerm: string;
}
