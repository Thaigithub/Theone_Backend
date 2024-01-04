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
    public object: RequestObject;

    @ApiProperty({
        type: 'enum',
        enum: SupportCategory,
        required: false,
        example: SupportCategory.HEADHUNTING,
    })
    @Expose()
    @IsEnum(SupportCategory)
    @IsOptional()
    public supportCategory: SupportCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public interviewRequestStartDate: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public interviewRequestEndDate: string;

    @ApiProperty({
        type: 'enum',
        enum: InterviewStatus,
        required: false,
        example: InterviewStatus.PASS,
    })
    @Expose()
    @IsEnum(InterviewStatus)
    @IsOptional()
    public interviewResult: InterviewStatus;
}
