import { Expose } from 'class-transformer';
import { IsNumber, IsString, Matches } from 'class-validator';
import { FileUploadRequest } from 'utils/generics/file.request';

export class SpecialLicenseMemberUpsertRequest {
    @Expose()
    @IsNumber()
    codeId: number;

    @Expose()
    @IsString()
    licenseNumber: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    acquisitionDate: string;

    @Expose()
    file: FileUploadRequest;
}
