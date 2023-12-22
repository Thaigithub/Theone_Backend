import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { ContractAdminGetListCategory } from '../dto/contract-admin-get-list-category.enum';
import { ContractAdminGetListSort } from '../dto/contract-admin-get-list-sort.enum';

export class ContractAdminGetListRequest {
    @ApiProperty({
        type: 'enum',
        enum: ContractAdminGetListCategory,
        required: false,
    })
    @Expose()
    @IsEnum(ContractAdminGetListCategory)
    @IsOptional()
    public category: ContractAdminGetListCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @ApiProperty({
        type: 'enum',
        enum: SitePeriodStatus,
        required: false,
    })
    @Expose()
    @IsEnum(SitePeriodStatus)
    @IsOptional()
    public siteStatus: SitePeriodStatus;

    @ApiProperty({
        type: 'enum',
        enum: ContractAdminGetListSort,
        required: false,
    })
    @Expose()
    @IsEnum(ContractAdminGetListSort)
    @IsOptional()
    public numberOfContracts: ContractAdminGetListSort;

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
