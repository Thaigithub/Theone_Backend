import { DisabledLevel, DisabledType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class AccountMemberUpsertDisabilityRequest {
    @Expose()
    @IsEnum(DisabledLevel)
    disabledLevel: DisabledLevel;

    @Expose()
    @IsEnum(DisabledType)
    disabledType: DisabledType;
}
