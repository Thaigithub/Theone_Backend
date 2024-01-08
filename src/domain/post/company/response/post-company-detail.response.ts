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
    type: PostType;

    @ApiProperty({
        type: 'enum',
        enum: PostCategory,
        example: PostCategory.GENERAL,
    })
    category: PostCategory;

    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    status: PostStatus;

    @ApiProperty({ example: 'string' })
    name: string;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    startDate: Date;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    endDate: Date;

    @ApiProperty({
        type: 'enum',
        enum: ExperienceType,
        example: ExperienceType.REGARDLESS,
    })
    experienceType: ExperienceType;

    @ApiProperty({ example: '1000' })
    numberOfPeople: number;

    @ApiProperty({
        type: PostCompanyCodeDTO,
    })
    specialOccupation: PostCompanyCodeDTO;

    @ApiProperty({
        type: PostCompanyCodeDTO,
    })
    occupation: PostCompanyCodeDTO;

    @ApiProperty({ example: 'string' })
    otherInformation: string;

    @IsEnum(SalaryType)
    @ApiProperty({
        type: 'enum',
        enum: SalaryType,
    })
    salaryType: SalaryType;

    @ApiProperty({ example: '1000000' })
    salaryAmount: number;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    startWorkDate: Date;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    endWorkDate: Date;

    @ApiProperty({
        description: 'List of Workday',
        example: ['MONDAY', 'TUESDAY'],
        isArray: true,
        enum: Workday,
    })
    workday: Workday[];

    @ApiProperty({ example: '09:00:00', format: 'time' })
    startWorkTime: Date;

    @ApiProperty({ example: '09:00:00', format: 'time' })
    endWorkTime: Date;

    @ApiProperty({ type: PostCompanyGetItemListSiteResponse })
    site: PostCompanyGetItemListSiteResponse;

    @ApiProperty({ example: 'string' })
    postEditor: string;
}
