import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ContractAdminGetListCategory } from '../enum/contract-admin-get-list-category.enum';
import { ContractAdminGetListSort } from '../enum/contract-admin-get-list-sort.enum';

export class ContractAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(ContractAdminGetListCategory)
    @IsOptional()
    category: ContractAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(SitePeriodStatus)
    @IsOptional()
    siteStatus: SitePeriodStatus;

    @Expose()
    @IsEnum(ContractAdminGetListSort)
    @IsOptional()
    numberOfContracts: ContractAdminGetListSort;
}
