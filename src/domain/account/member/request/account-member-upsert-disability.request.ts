import { DisabledLevel, DisabledType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class AccountMemberUpsertDisabilityRequest {
    @Expose()
    @IsEnum(DisabledLevel)
    disabledLevel: DisabledLevel;

    @Expose()
    @IsEnum(DisabledType)
    disabledType: DisabledType;

    @Expose()
    file: FileRequest;
}
