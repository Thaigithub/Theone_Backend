import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HeadhuntingAdminGetListCategory } from '../dto/headhunting-admin-get-list-category.enum';
import { HeadhuntingAdminGetListRequestStatusEnum } from '../dto/headhunting-admin-get-list-request-status.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class HeadhuntingAdminGetListRequestRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public startRequestDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public endRequestDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListCategory)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListCategory,
        required: false,
    })
    public category: HeadhuntingAdminGetListCategory;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListRequestStatusEnum)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListRequestStatusEnum,
        required: false,
    })
    public status: HeadhuntingAdminGetListRequestStatusEnum;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public keyword: string;
}
