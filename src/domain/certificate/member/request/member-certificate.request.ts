import { ApiProperty } from '@nestjs/swagger';
import { CertificateStatus, FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsISO8601, IsNumber, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class GetMemberCertificateRequest extends PaginationRequest {}

export class UpsertMemberCertificateRequest {
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
}

export class PartialUpdateMemberCertificateRequest {
    @Expose()
    @IsEnum(CertificateStatus)
    @ApiProperty({
        type: 'enum',
        enum: CertificateStatus,
        example: CertificateStatus.APPROVED,
    })
    public certificationStatus: CertificateStatus;
}
