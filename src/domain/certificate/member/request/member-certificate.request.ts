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
    name: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: '000-111-222' })
    certificateNumber: string;

    @Expose()
    @IsISO8601()
    @ApiProperty({ example: '2020-10-10T00:00:00Z' })
    acquisitionDate: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'asdfhjawbecqertq' })
    fileKey: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'basic.pdf' })
    fileName: string;

    @Expose()
    @IsEnum(FileType)
    @ApiProperty({
        type: 'enum',
        enum: FileType,
        example: FileType.PDF,
    })
    fileType: FileType;

    @Expose()
    @IsNumber()
    @ApiProperty({ example: 100 })
    fileSize: number;
}

export class PartialUpdateMemberCertificateRequest {
    @Expose()
    @IsEnum(CertificateStatus)
    @ApiProperty({
        type: 'enum',
        enum: CertificateStatus,
        example: CertificateStatus.APPROVED,
    })
    certificationStatus: CertificateStatus;
}
