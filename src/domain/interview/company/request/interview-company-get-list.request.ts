import { ApiProperty } from '@nestjs/swagger';
import { InterviewStatus, RequestObject, SupportCategory } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class InterviewCompantGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'enum',
        enum: RequestObject,
        required: false,
        example: RequestObject.INDIVIDUAL,
    })
    @Expose()
    @IsEnum(RequestObject)
    object: RequestObject;

    @ApiProperty({
        type: 'enum',
        enum: SupportCategory,
        required: false,
        example: SupportCategory.HEADHUNTING,
    })
    @Expose()
    @IsEnum(SupportCategory)
    @IsOptional()
    supportCategory: SupportCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    interviewRequestStartDate: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    interviewRequestEndDate: string;

    @ApiProperty({
        type: 'enum',
        enum: InterviewStatus,
        required: false,
        example: InterviewStatus.PASS,
    })
    @Expose()
    @IsEnum(InterviewStatus)
    @IsOptional()
    interviewResult: InterviewStatus;
}
