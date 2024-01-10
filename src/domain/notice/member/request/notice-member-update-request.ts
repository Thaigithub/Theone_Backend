import { NoticeStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class NoticeMemberUpdateRequest {
    @Expose()
    @IsEnum(NoticeStatus)
    status: NoticeStatus;
}
