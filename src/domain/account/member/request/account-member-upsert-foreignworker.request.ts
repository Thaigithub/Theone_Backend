import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsString, Matches } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class AccountMemberUpsertForeignWorkerRequest {
    @Expose()
    @IsString()
    englishName: string;

    @Expose()
    @IsString()
    registrationNumber: string;

    @Expose()
    @IsString()
    serialNumber: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    dateOfIssue: string;

    @Expose()
    @IsNotEmptyObject()
    file: FileRequest;
}
