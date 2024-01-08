import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export enum SiteEvaluationSearchCategory {
    COMPANY_NAME = 'COMPANY_NAME',
    SITE_NAME = 'SITE_NAME',
}

export class SiteEvaluationAdminGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'boolean',
        required: false,
    })
    @Expose()
    @IsBooleanString()
    @IsOptional()
    isHighestRating: string;

    @ApiProperty({
        type: 'enum',
        enum: SiteEvaluationSearchCategory,
        required: false,
    })
    @Expose()
    @IsEnum(SiteEvaluationSearchCategory)
    @IsOptional()
    searchCategory: SiteEvaluationSearchCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
