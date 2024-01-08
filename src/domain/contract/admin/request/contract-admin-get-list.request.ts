import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ContractAdminGetListCategory } from '../dto/contract-admin-get-list-category.enum';
import { ContractAdminGetListSort } from '../dto/contract-admin-get-list-sort.enum';

export class ContractAdminGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'enum',
        enum: ContractAdminGetListCategory,
        required: false,
    })
    @Expose()
    @IsEnum(ContractAdminGetListCategory)
    @IsOptional()
    category: ContractAdminGetListCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @ApiProperty({
        type: 'enum',
        enum: SitePeriodStatus,
        required: false,
    })
    @Expose()
    @IsEnum(SitePeriodStatus)
    @IsOptional()
    siteStatus: SitePeriodStatus;

    @ApiProperty({
        type: 'enum',
        enum: ContractAdminGetListSort,
        required: false,
    })
    @Expose()
    @IsEnum(ContractAdminGetListSort)
    @IsOptional()
    numberOfContracts: ContractAdminGetListSort;
}
