import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { HeadhuntingAdminGetListCategory } from '../dto/headhunting-admin-get-list-category.enum';
import { HeadhuntingAdminGetListRequestStatusEnum } from '../dto/headhunting-admin-get-list-request-status.enum';

export class HeadhuntingAdminGetListRequestRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    startRequestDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    endRequestDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListCategory)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListCategory,
        required: false,
    })
    category: HeadhuntingAdminGetListCategory;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListRequestStatusEnum)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListRequestStatusEnum,
        required: false,
    })
    status: HeadhuntingAdminGetListRequestStatusEnum;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    keyword: string;
}
