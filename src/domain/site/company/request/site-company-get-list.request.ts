import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SiteCompanyGetListStatus } from '../enum/site-company-get-list-status.enum';

export class SiteCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SiteCompanyGetListStatus)
    @IsOptional()
    progressStatus: SiteCompanyGetListStatus;
}
