import { Expose } from 'class-transformer';
import { IsNumber, IsString, Matches } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class LicenseMemberUpsertRequest {
    @Expose()
    @IsNumber()
    codeId: number;

    @Expose()
    @IsString()
    licenseNumber: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    acquisitionDate: string;

    @Expose()
    file: FileRequest;
}
