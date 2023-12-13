import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString, Matches } from 'class-validator';
import { SiteSearchCaterory } from '../dto/banner-admin-search-category.dto';

export class AdminBannerGetSiteRequest {
    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        required: false,
        example: '1',
    })
    public pageNumber: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        required: false,
        example: '1',
    })
    public pageSize: string;

    @Expose()
    @IsOptional()
    @IsEnum(SiteSearchCaterory)
    @ApiProperty({
        required: false,
        type: SiteSearchCaterory,
        example: SiteSearchCaterory.COMPANY,
    })
    public search: SiteSearchCaterory;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'The one',
    })
    public keyword: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        required: false,
        description: 'Request start date',
        example: '2023-05-10',
    })
    readonly requestStartDate: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        required: false,
        description: 'Request End date',
        example: '2023-05-10',
    })
    readonly requestEndDate: string;
}
