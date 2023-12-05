import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsNumberString } from 'class-validator';

export class AdminCompanyDownloadListRequest {
    @Expose()
    @IsArray()
    @ArrayNotEmpty({ message: 'The array must not be empty' })
    @IsNumber({}, { each: true, message: 'Each element of the array must be a number' })
    @ApiProperty({ example: [1, 2, 3] })
    public companyIds: string[];
}

export class AdminCompanyDownloadRequest {
    @Expose()
    @IsNumberString()
    @ApiProperty({ example: '1' })
    public companyIds: string;
}
