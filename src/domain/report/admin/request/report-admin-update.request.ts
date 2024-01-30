import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class ReportAdminUpdateRequest {
    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsString()
    content: string;

    @Expose()
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(3)
    files: FileRequest[];
}
