import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { PostAdminPostStatusFilter, PostAdminPostTypeFilter, PostAdminSearchCategoryFilter } from '../dto/post-admin-filter';

export class PostAdminGetListRequest {
    @Expose()
    @IsEnum(PostAdminPostTypeFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostAdminPostTypeFilter,
        required: false,
    })
    public type: PostAdminPostTypeFilter;

    @Expose()
    @IsEnum(PostAdminPostStatusFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostAdminPostStatusFilter,
        required: false,
    })
    public status: PostAdminPostStatusFilter;

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
    public startDate: string;

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
    public endDate: string;

    @Expose()
    @IsEnum(PostAdminSearchCategoryFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostAdminSearchCategoryFilter,
        required: false,
    })
    public searchCategory: PostAdminSearchCategoryFilter;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public searchTerm: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: 'number',
        required: false,
    })
    public pageSize: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: 'number',
        required: false,
    })
    public pageNumber: number;
}
