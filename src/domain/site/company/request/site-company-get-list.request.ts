import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ProgressStatus } from '../dto/site-company-progress-status.enum';

export class SiteCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(ProgressStatus)
    @IsOptional()
    progressStatus: ProgressStatus;
}
