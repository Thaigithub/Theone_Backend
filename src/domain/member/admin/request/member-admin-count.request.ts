import { AccountStatus, MemberLevel } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class MemberAdminGetCountRequest {
    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    level: MemberLevel;

    @Expose()
    @IsEnum(AccountStatus)
    @IsOptional()
    accountStatus: AccountStatus;
}
