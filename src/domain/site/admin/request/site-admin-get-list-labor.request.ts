import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SitePeriodStatus } from 'utils/get-site-status';
import { SiteAdminGetListLaborCategory } from '../enum/site-admin-get_list-labor-category.enum';
import { SiteAdminGetListLaborSort } from '../enum/site-admin-get_list-labor-sort.enum';

export class SiteAdminGetListLaborRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SiteAdminGetListLaborCategory)
    @IsOptional()
    category: SiteAdminGetListLaborCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(SiteAdminGetListLaborSort)
    @IsOptional()
    numberOfWorkers: SiteAdminGetListLaborSort;

    @Expose()
    @IsEnum(SitePeriodStatus)
    @IsOptional()
    siteStatus: SitePeriodStatus;
}
