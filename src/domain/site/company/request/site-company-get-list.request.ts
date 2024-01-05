import { SiteStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SiteCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SiteStatus)
    @IsOptional()
    status: SiteStatus;
}
