import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
    ApplicationAdminSearchCategoryFilter,
    ApplicationAdminSortFilter,
    ApplicationAdminStatusFilter,
} from '../dto/application-admin-filter';

export class ApplicationAdminGetPostListRequest {
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
