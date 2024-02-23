import { ResidenceStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmptyObject, IsString } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class AccountMemberUpsertForeignWorkerRequest {
    @Expose()
    @IsString()
    englishName: string;

    @Expose()
    @IsString()
    registrationNumber: string;

    @Expose()
    @IsEnum(ResidenceStatus)
    residenceStatus: ResidenceStatus;

    @Expose()
    @IsNotEmptyObject()
    file: FileRequest;
}
