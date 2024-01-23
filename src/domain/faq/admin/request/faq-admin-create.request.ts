import { FaqCategory, InquirerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class FaqAdminCreateRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    question: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    answer: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    writer: string;

    @Expose()
    @IsEnum(InquirerType)
    inquirerType: InquirerType;

    @Expose()
    @IsEnum(FaqCategory)
    category: FaqCategory;

    @Expose()
    @IsArray()
    @ArrayMaxSize(3)
    files: FileRequest[];
}
