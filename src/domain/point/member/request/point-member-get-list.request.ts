import { PointStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PointMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(PointStatus)
    @IsOptional()
    status: PointStatus;
}
