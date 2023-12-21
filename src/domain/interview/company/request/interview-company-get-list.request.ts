import { ApiProperty } from '@nestjs/swagger';
import { InterviewStatus, RequestObject, SupportCategory } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { InterviewCompanySearchCategories } from '../dto/interview-company-search-category.enum';

export class InterviewCompantGetListRequest {
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
        type: 'enum',
        enum: InterviewCompanySearchCategories,
        required: false,
    })
    @Expose()
    @IsEnum(InterviewCompanySearchCategories)
    @IsOptional()
    public searchCategory: InterviewCompanySearchCategories;

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

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
}
