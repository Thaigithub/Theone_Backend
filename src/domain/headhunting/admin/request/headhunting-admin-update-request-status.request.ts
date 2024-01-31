import { HeadhuntingRequestStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';

export class HeadhuntingAdminUpdateRequestStatusRequest {
    @Expose()
    @IsEnum(HeadhuntingRequestStatus)
    status: HeadhuntingRequestStatus;

    @Expose()
    @MaxLength(500)
    @IsOptional()
    reason: string;
}
