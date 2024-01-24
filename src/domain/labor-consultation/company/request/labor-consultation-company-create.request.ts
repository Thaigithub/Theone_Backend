import { LaborConsultationType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class LaborConsultationCompanyCreateRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;

    @Expose()
    @IsEnum(LaborConsultationType)
    type: LaborConsultationType;

    @Expose()
    @IsArray()
    @ArrayMaxSize(3)
    files: FileRequest[];
}
