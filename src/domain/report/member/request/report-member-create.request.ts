import { ReportType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class ReportMemberCreateRequest {
    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsString()
    content: string;

    @Expose()
    @IsEnum(ReportType)
    type: ReportType;

    @Expose()
    @IsOptional()
    file: FileRequest;
}
