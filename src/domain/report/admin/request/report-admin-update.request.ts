import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
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
    file: FileRequest;
}
