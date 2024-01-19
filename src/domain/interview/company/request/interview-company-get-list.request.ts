import { ApplicationCategory, InterviewStatus, RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class InterviewCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(RequestObject)
    object: RequestObject;

    @Expose()
    @IsEnum(ApplicationCategory)
    @IsOptional()
    category: ApplicationCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsString()
    @IsOptional()
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endDate: string;

    @Expose()
    @IsEnum(InterviewStatus)
    @IsOptional()
    result: InterviewStatus;
}
