import { DisabledLevel, DisabledType, FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsISO8601, IsNumber, IsNumberString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpsertDisabilityRequest {
    @Expose()
    @IsEnum(DisabledLevel)
    @ApiProperty({
        type: 'enum',
        enum: DisabledLevel,
        example: DisabledLevel,
    })
    public disabledLevel: DisabledLevel;

    @Expose()
    @IsEnum(DisabledType)
    @ApiProperty({
        type: 'enum',
        enum: DisabledType,
        example: DisabledType.BURN,
    })
    public disabledType: DisabledType;

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

class UpsertHSTCertificateRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: '123456' })
    public registrationNumber: string;

    @Expose()
    @IsISO8601()
    @ApiProperty({ example: '2020-10-10T00:00:00Z' })
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

class UpsertForeignWorkerRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'The One' })
    public englishName: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: '123456' })
    public registrationNumber: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: '123456' })
    public serialNumber: string;

    @Expose()
    @IsISO8601()
    @ApiProperty({ example: '2020-10-10T00:00:00Z' })
    public dateOfIssue: string;

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

class UpsertBankAccountRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'TheOne' })
    public accountHolder: string;

    @Expose()
    @IsNumberString()
    @ApiProperty({ example: '1233534' })
    public accountNumber: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'ACB' })
    public bankName: string;
}

export { UpsertDisabilityRequest, UpsertHSTCertificateRequest, UpsertForeignWorkerRequest, UpsertBankAccountRequest }
