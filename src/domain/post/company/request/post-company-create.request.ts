import { ExperienceType, PostCategory, SalaryType, Workday } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class PostCompanyCreateRequest {
    @Expose()
    @IsEnum(PostCategory)
    category: PostCategory;

    @Expose()
    @IsString()
    @Length(1, 50, { message: 'Post name should be maximum 50 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @Expose()
    @IsNotEmpty({ message: 'startDate is required' })
    startDate: string;

    @Expose()
    @IsNotEmpty({ message: 'endDate is required' })
    endDate: string;

    @Expose()
    @IsEnum(ExperienceType)
    experienceType: ExperienceType;

    @Expose()
    @IsNotEmpty({ message: 'Number of people recruited is required' })
    @IsNumber()
    numberOfPeople: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    occupationId: number;

    @Expose()
    @IsString()
    @MaxLength(100, { message: 'Post name should be maximum 50 characters' })
    @IsOptional()
    otherInformation: string;

    @Expose()
    @IsEnum(SalaryType)
    @IsOptional()
    salaryType: SalaryType;

    @Expose()
    @IsNotEmpty({ message: 'Amount of salary is required' })
    @IsNumber()
    @IsOptional()
    salaryAmount: number;

    @Expose()
    @IsNotEmpty({ message: 'Start working date is required' })
    @IsOptional()
    startWorkDate: string;

    @Expose()
    @IsNotEmpty({ message: 'End working date is required' })
    @IsOptional()
    endWorkDate: string;

    @Expose()
    @IsEnum(Workday, { each: true })
    @IsOptional()
    workday: Workday[];

    @Expose()
    @IsNotEmpty({ message: 'Start working time is required' })
    @IsOptional()
    startWorkTime: string;

    @Expose()
    @IsNotEmpty({ message: 'End working time is required' })
    @IsOptional()
    endWorkTime: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    siteId: number;

    @Expose()
    @IsString()
    @MaxLength(1000, { message: 'Post name should be maximum 1000 characters' })
    @IsOptional()
    postEditor: string;
}
