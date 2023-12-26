import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Matches } from 'class-validator';

export class UpsertHSTCertificateRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: '123456' })
    private _registrationNumber: string;
    public get registrationNumber(): string {
        return this._registrationNumber;
    }
    public set registrationNumber(value: string) {
        this._registrationNumber = value;
    }

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({ example: '2020-10-10' })
    public dateOfCompletion: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'asdfhjawbecqertq' })
    public fileKey: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'basic.pdf' })
    public fileName: string;

    @Expose()
    @IsEnum(FileType)
    @ApiProperty({
        type: 'enum',
        enum: FileType,
        example: FileType.PDF,
    })
    public fileType: FileType;

    @Expose()
    @IsNumber()
    @ApiProperty({ example: 100 })
    public fileSize: number;
}
