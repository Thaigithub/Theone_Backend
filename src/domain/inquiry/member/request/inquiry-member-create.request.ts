import { InquiryType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class InquiryMemberCreateRequest {
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
    @IsEnum(InquiryType)
    type: InquiryType;

    @Expose()
    @IsArray()
    files: FileRequest[];
}
