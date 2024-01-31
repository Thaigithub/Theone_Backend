import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class InquiryAdminAnswerRequest {
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
    files: FileRequest[];
}
