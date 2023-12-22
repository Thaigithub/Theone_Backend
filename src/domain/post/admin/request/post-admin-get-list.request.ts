import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import {
    ApplicationAdminSearchCategoryFilter,
    ApplicationAdminSortFilter,
    ApplicationAdminStatusFilter,
    PostAdminPostStatusFilter,
    PostAdminPostTypeFilter,
    PostAdminSearchCategoryFilter,
} from '../dto/post-admin-filter';

class BaseListRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public searchTerm: string;

    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: 'number',
        required: false,
    })
    public pageSize: number;

    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: 'number',
        required: false,
    })
    public pageNumber: number;
}

export class ApplicationAdminGetListRequest extends BaseListRequest {
    @Expose()
    @IsEnum(ApplicationAdminStatusFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: ApplicationAdminStatusFilter,
        required: false,
    })
    public status: ApplicationAdminStatusFilter;

    @Expose()
    @IsEnum(ApplicationAdminSearchCategoryFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: ApplicationAdminSearchCategoryFilter,
        required: false,
    })
    public searchCategory: ApplicationAdminSearchCategoryFilter;

    @Expose()
    @IsEnum(ApplicationAdminSortFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: ApplicationAdminSortFilter,
        required: false,
    })
    public sortByApplication: ApplicationAdminSortFilter;
}

export class PostAdminGetListRequest extends BaseListRequest {
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
}
