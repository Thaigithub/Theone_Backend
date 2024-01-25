import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class LaborConsultationAdminAnswerRequest {
    @Expose()
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    title: string;

    @Expose()
    @MaxLength(1000)
    @IsString()
    @IsNotEmpty()
    content: string;

    @Expose()
    @IsArray()
    @ArrayMaxSize(3)
    files: FileRequest[];
}
