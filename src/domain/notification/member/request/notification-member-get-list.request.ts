import { NotificationStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class NotificationMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(NotificationStatus)
    @IsOptional()
    status: NotificationStatus;
}
