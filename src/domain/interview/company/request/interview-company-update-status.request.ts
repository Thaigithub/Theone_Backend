import { InterviewStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class InterviewCompanyUpdateStatusRequest {
    @Expose()
    @IsEnum(InterviewStatus)
    status: InterviewStatus;
}
