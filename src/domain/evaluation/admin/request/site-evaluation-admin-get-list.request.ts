import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBooleanString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum SiteEvaluationSearchCategory {
    COMPANY_NAME = 'COMPANY_NAME',
    SITE_NAME = 'SITE_NAME',
}

export class SiteEvaluationAdminGetListRequest {
    @ApiProperty({
        type: 'boolean',
        required: false,
    })
    @Expose()
    @IsBooleanString()
    @IsOptional()
    public isHighestRating: string;

    @ApiProperty({
        type: 'enum',
        enum: SiteEvaluationSearchCategory,
        required: false,
    })
    @Expose()
    @IsEnum(SiteEvaluationSearchCategory)
    @IsOptional()
    public searchCategory: SiteEvaluationSearchCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
}
