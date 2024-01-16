import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Workday } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
} from 'class-validator';

export class PostAdminUpdateRequest {
    @Expose()
    @IsEnum(PostCategory)
    @IsOptional()
    category: PostCategory;

    @Expose()
    @IsEnum(PostStatus)
    @IsOptional()
    status: PostStatus;

    @Expose()
    @IsString()
    @Length(1, 50, { message: 'Post name should be maximum 50 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsOptional()
    name: string;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isHidden: boolean;

    @Expose()
    @IsString()
    @IsNotEmpty({ message: 'Work Location is required' })
    @IsOptional()
    workLocation: string;

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
    @IsEnum(ExperienceType)
    @IsOptional()
    experienceType: ExperienceType;

    @Expose()
    @IsNumber()
    @IsOptional()
    numberOfPeople: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    specialNoteId: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    occupationId: number;

    @Expose()
    @IsString()
    @MaxLength(100, { message: 'Other information should have maximum 100 characters' })
    @IsOptional()
    otherInformation: string;

    @Expose()
    @IsEnum(SalaryType)
    @IsOptional()
    salaryType: SalaryType;

    @Expose()
    @IsNumber()
    @IsOptional()
    salaryAmount: number;

    @Expose()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startWorkDate: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    endWorkDate: string;

    @Expose()
    @IsEnum(Workday, { each: true })
    @IsOptional()
    workday: Workday[];

    @Expose()
    @IsOptional()
    startWorkTime: string;

    @Expose()
    @IsOptional()
    endWorkTime: string;

    @Expose()
    @IsString()
    @MaxLength(1000, { message: 'Post name should be maximum 1000 characters' })
    @IsOptional()
    postEditor: string;

    @Expose()
    @IsString()
    @MaxLength(500, { message: 'The reason for updating notice should be maximun 500 characters' })
    updateReason: string;

    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    type: PostType;
}
