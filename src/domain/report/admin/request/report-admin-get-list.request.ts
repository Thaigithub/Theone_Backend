import { AnswerStatus, ReportType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class ReportAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(ReportType)
    reportType: ReportType;

    @Expose()
    @IsOptional()
    @IsEnum(AnswerStatus)
    status: AnswerStatus;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsOptional()
    @IsString()
    keyword: string;
}
