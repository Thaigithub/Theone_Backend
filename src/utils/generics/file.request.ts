import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class FileUploadRequest {
    @Expose()
    @ApiProperty()
    fileName: string;

    @Expose()
    @ApiProperty()
    size: number;

    @Expose()
    @ApiProperty()
    @IsEnum(FileType)
    type: FileType;

    @Expose()
    @ApiProperty()
    key: string;
}
