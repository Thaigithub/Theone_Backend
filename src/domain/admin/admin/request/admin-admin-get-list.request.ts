import { ApiProperty } from '@nestjs/swagger';
import { AdminLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AdminSearchCategories } from '../dto/admin-admin-search';

export class AdminAdminGetListRequest {
    @ApiProperty({
        type: 'enum',
        enum: AdminLevel,
        required: false,
    })
    @Expose()
    @IsEnum(AdminLevel)
    @IsOptional()
    public level: AdminLevel;

    @ApiProperty({
        type: 'enum',
        enum: AdminSearchCategories,
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
