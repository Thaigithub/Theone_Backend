import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { WorkAdminGetListCategory } from '../dto/work-admin-get-list-category.enum';
import { WorkAdminGetListSort } from '../dto/work-admin-get-list-sort.enum';

export class WorkAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(WorkAdminGetListCategory)
    @IsOptional()
    category: WorkAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(WorkAdminGetListSort)
    @IsOptional()
    numberOfWorkers: WorkAdminGetListSort;

    @Expose()
    @IsEnum(SitePeriodStatus)
    @IsOptional()
    siteStatus: SitePeriodStatus;
}
