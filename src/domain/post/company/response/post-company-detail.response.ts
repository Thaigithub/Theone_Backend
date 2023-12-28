import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Workday } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { PostCompanyCodeDTO } from '../dto/post-company-code.dto';
import { PostCompanyGetItemListSiteResponse } from './post-company-get-item-list.response';

export class PostCompanyDetailResponse {
    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    public type: PostType;

    @ApiProperty({
        type: 'enum',
        enum: PostCategory,
        example: PostCategory.GENERAL,
    })
    public category: PostCategory;

    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    public status: PostStatus;

    @ApiProperty({ example: 'string' })
    public name: string;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    public startDate: Date;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    public endDate: Date;

    @ApiProperty({
        type: 'enum',
        enum: ExperienceType,
        example: ExperienceType.REGARDLESS,
    })
    public experienceType: ExperienceType;

    @ApiProperty({ example: '1000' })
    public numberOfPeople: number;

    @ApiProperty({
        type: PostCompanyCodeDTO,
    })
    public specialOccupation: PostCompanyCodeDTO;

    @ApiProperty({
        type: PostCompanyCodeDTO,
    })
    public occupation: PostCompanyCodeDTO;

    @ApiProperty({ example: 'string' })
    public otherInformation: string;

    @IsEnum(SalaryType)
    @ApiProperty({
        type: 'enum',
        enum: SalaryType,
        example: SalaryType.FIRST_CLASS,
    })
    public salaryType: SalaryType;

    @ApiProperty({ example: '1000000' })
    public salaryAmount: number;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    public startWorkDate: Date;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    public endWorkDate: Date;

    @ApiProperty({
        description: 'List of Workday',
        example: ['MONDAY', 'TUESDAY'],
        isArray: true,
        enum: Workday,
    })
    public workday: Workday[];

    @ApiProperty({ example: '09:00:00', format: 'time' })
    public startWorkTime: Date;

    @ApiProperty({ example: '09:00:00', format: 'time' })
    public endWorkTime: Date;

    @ApiProperty({ type: PostCompanyGetItemListSiteResponse })
    public site: PostCompanyGetItemListSiteResponse;

    @ApiProperty({ example: 'string' })
    public postEditor: string;
}
