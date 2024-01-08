import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PointAdminSearchCategoryFilter, PointAdminSortCategoryFilter } from '../dto/point-admin-filter';

export class PointAdminGetListRequest extends PaginationRequest {
    @Expose()
    @ApiProperty()
    @IsEnum(PointAdminSortCategoryFilter)
    @ApiProperty({
        type: 'enum',
        enum: PointAdminSortCategoryFilter,
        required: false,
    })
    @IsOptional()
    pointHeld: PointAdminSortCategoryFilter;

    @Expose()
    @ApiProperty()
    @IsEnum(PointAdminSearchCategoryFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PointAdminSearchCategoryFilter,
        required: false,
    })
    searchCategory: PointAdminSearchCategoryFilter;

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
