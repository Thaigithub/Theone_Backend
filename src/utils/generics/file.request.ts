import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class FileUploadRequest {
    @Expose()
    fileName: string;

    @Expose()
    size: number;

    @Expose()
    @IsEnum(FileType)
    type: FileType;

    @Expose()
    key: string;
}
