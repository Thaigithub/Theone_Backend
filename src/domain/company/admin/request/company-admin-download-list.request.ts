import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsNumberString } from 'class-validator';

export class AdminCompanyDownloadListRequest {
    @Expose()
    @IsArray()
    @ArrayNotEmpty({ message: 'The array must not be empty' })
    @IsNumber({}, { each: true, message: 'Each element of the array must be a number' })
    companyIds: string[];
}

export class AdminCompanyDownloadRequest {
    @Expose()
    @IsNumberString()
    companyIds: string;
}
