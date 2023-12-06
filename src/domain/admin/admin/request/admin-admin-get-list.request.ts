import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AdminLevelRequest, AdminSearchCategories } from '../dto/admin-admin-search';

export class GetAdminListRequest {
    @ApiProperty({
        type: 'enum',
        enum: AdminLevelRequest,
        required: false,
    })
    @Expose()
    @IsEnum(AdminLevelRequest)
    @IsOptional()
    public level: AdminLevelRequest;

    @ApiProperty({
        type: AdminSearchCategories,
        required: false,
    })
    @Expose()
    @IsEnum(AdminSearchCategories)
    @IsOptional()
    public searchCategory: AdminSearchCategories;

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
