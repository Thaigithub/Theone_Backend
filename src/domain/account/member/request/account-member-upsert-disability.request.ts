import { DisabledLevel, DisabledType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum } from 'class-validator';

export class AccountMemberUpsertDisabilityRequest {
    @Expose()
    @IsEnum(DisabledLevel)
    disabledLevel: DisabledLevel;

    @Expose()
    @IsEnum(DisabledType, { each: true })
    @IsArray()
    @ArrayUnique()
    disabledTypeList: DisabledType[];
}
