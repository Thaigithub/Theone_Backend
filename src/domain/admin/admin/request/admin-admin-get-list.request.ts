import { ApiProperty } from '@nestjs/swagger';
import { AdminLevel } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AdminSearchCategories } from '../dto/admin-admin-search';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class AdminAdminGetListRequest extends PaginationRequest {
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
}
