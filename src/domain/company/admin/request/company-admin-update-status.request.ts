import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class AdminCompanyUpdateStatusRequest {
    @Expose()
    @IsEnum(AccountStatus)
    @ApiProperty({ description: 'Company Status', example: AccountStatus.APPROVED })
    public status: AccountStatus;
}
