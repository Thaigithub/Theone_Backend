import { InterviewStatus, RequestObject, SupportCategory } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class InterviewCompantGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(RequestObject)
    object: RequestObject;

    @Expose()
    @IsEnum(SupportCategory)
    @IsOptional()
    supportCategory: SupportCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsString()
    @IsOptional()
    interviewRequestStartDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    interviewRequestEndDate: string;

    @Expose()
    @IsEnum(InterviewStatus)
    @IsOptional()
    interviewResult: InterviewStatus;
}
