import { AccountStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class AdminCompanyUpdateStatusRequest {
    @Expose()
    @IsEnum(AccountStatus)
    status: AccountStatus;
}
