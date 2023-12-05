import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetMemberCertificateRequest {
    @Expose()
    @IsNumber()
    @IsOptional()
    public memberId: number;

    @Expose()
    @IsNumber()
    @ApiProperty({ example: 1 })
    public page: number;

    @Expose()
    @IsNumber()
    @ApiProperty({ example: 20 })
    public size: number;

    @Expose()
    @IsBoolean()
    @ApiProperty({ example: false })
    public isSpecial: boolean;
}

export class UpSertMemberCertificateRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'Certificate 1' })
    public name: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: '000-111-222' })
    public certificateNumber: string;

    @Expose()
    @IsISO8601()
    @ApiProperty({ example: '2020-10-10T00:00:00Z' })
    public acquisitionDate: string;

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

    @Expose()
    @IsBoolean()
    @ApiProperty({ example: false })
    public isSpecial: boolean;
}
