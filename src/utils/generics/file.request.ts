import { FileType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class FileRequest {
    @Expose()
    @IsString()
    fileName: string;

    @Expose()
    @IsString()
    size: number;

    @Expose()
    @IsEnum(FileType)
    type: FileType;

    @Expose()
    @IsString()
    key: string;
}
