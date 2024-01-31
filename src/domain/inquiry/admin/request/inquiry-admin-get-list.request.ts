import { AnswerStatus, InquirerType, InquiryType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { InquiryAdminGetListCategory } from '../enum/inquiry-admin-get-list-category.enum';

export class InquiryAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    startDate: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    endDate: string;

    @Expose()
    @IsEnum(InquirerType)
    @IsOptional()
    inquirerType: InquirerType;

    @Expose()
    @IsEnum(AnswerStatus)
    @IsOptional()
    status: AnswerStatus;

    @Expose()
    @IsEnum(InquiryType)
    @IsOptional()
    inquiryType: InquiryType;

    @Expose()
    @IsEnum(InquiryAdminGetListCategory)
    @IsOptional()
    searchCategory: InquiryAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
