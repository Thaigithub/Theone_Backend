import { AnswerStatus, InquirerType, LaborConsultationType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { LaborConsultationAdminGetListCategory } from '../enum/labor-consultation-admin-get-list-category.enum';

export class LaborConsultationAdminGetListRequest extends PaginationRequest {
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
    @IsEnum(LaborConsultationType)
    @IsOptional()
    laborConsultationType: LaborConsultationType;

    @Expose()
    @IsEnum(LaborConsultationAdminGetListCategory)
    @IsOptional()
    searchCategory: LaborConsultationAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
