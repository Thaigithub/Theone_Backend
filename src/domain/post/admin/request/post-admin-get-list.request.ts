import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import {
    ApplicationAdminSearchCategoryFilter,
    ApplicationAdminSortFilter,
    ApplicationAdminStatusFilter,
    PostAdminPostStatusFilter,
    PostAdminPostTypeFilter,
    PostAdminSearchCategoryFilter,
} from '../dto/post-admin-filter';

class BaseListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    searchTerm: string;
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
    status: ApplicationAdminStatusFilter;

    @Expose()
    @IsEnum(ApplicationAdminSearchCategoryFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: ApplicationAdminSearchCategoryFilter,
        required: false,
    })
    searchCategory: ApplicationAdminSearchCategoryFilter;

    @Expose()
    @IsEnum(ApplicationAdminSortFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: ApplicationAdminSortFilter,
        required: false,
    })
    sortByApplication: ApplicationAdminSortFilter;
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
    type: PostAdminPostTypeFilter;

    @Expose()
    @IsEnum(PostAdminPostStatusFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostAdminPostStatusFilter,
        required: false,
    })
    status: PostAdminPostStatusFilter;

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
    @IsEnum(PostAdminSearchCategoryFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostAdminSearchCategoryFilter,
        required: false,
    })
    searchCategory: PostAdminSearchCategoryFilter;
}
