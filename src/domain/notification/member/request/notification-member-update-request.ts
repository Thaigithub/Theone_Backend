import { NotificationStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class NotificationMemberUpdateRequest {
    @Expose()
    @IsEnum(NotificationStatus)
    status: NotificationStatus;
}
