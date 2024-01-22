import { InquiryType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class InquiryCompanyCreateRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    title: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;

    @Expose()
    @IsEnum(InquiryType)
    type: InquiryType;

    @Expose()
    @IsNotEmptyObject()
    @IsOptional()
    file: FileRequest;
}
