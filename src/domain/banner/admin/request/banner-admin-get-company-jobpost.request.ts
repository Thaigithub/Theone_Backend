import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString, Matches } from 'class-validator';
import { PostSearchCaterory } from '../dto/banner-admin-search-category.dto';

export class AdminBannerGetCompanyJobPostRequest {
    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public pageNumber: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public pageSize: string;

    @Expose()
    @IsOptional()
    @IsEnum(PostSearchCaterory)
    @ApiProperty({ type: PostSearchCaterory, example: PostSearchCaterory.COMPANY })
    public search: PostSearchCaterory;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'The one' })
    public keyword: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
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
        description: 'Request End date',
        example: '2023-05-10',
    })
    readonly requestEndDate: string;
}
