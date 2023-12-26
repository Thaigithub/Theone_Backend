import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsISO8601, IsNumber, IsString } from 'class-validator';

export class UpsertForeignWorkerRequest {
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
