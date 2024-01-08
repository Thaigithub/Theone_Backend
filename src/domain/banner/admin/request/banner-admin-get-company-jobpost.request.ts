import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PostSearchCaterory } from '../enum/banner-admin-post-search-category.enum';

export class BannerAdminGetCompanyJobPostRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(PostSearchCaterory)
    @ApiProperty({
        required: false,
        type: PostSearchCaterory,
        example: PostSearchCaterory.COMPANY,
    })
    searchCategory: PostSearchCaterory;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'The one',
    })
    searchKeyword: string;

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
