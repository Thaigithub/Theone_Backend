import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { HeadhuntingAdminGetListCategory } from '../dto/headhunting-admin-get-list-category.enum';
import { HeadhuntingAdminGetListRequestStatusEnum } from '../dto/headhunting-admin-get-list-request-status.enum';

export class HeadhuntingAdminGetListRequestRequest {
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
