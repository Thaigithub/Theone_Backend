import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Workday } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class PostCompanyCreateRequest {
    @Expose()
    @IsEnum(PostType)
    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    type: PostType;

    @Expose()
    @IsEnum(PostCategory)
    @ApiProperty({
        type: 'enum',
        enum: PostCategory,
        example: PostCategory.GENERAL,
    })
    category: PostCategory;

    @Expose()
    @IsEnum(PostStatus)
    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    status: PostStatus;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 50, { message: 'Post name should be maximum 50 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @Expose()
    @ApiProperty({ example: '2023-12-31' })
    @IsNotEmpty({ message: 'startDate is required' })
    startDate: string;

    @Expose()
    @ApiProperty({ example: '2023-12-31' })
    @IsNotEmpty({ message: 'endDate is required' })
    endDate: string;

    @Expose()
    @IsEnum(ExperienceType)
    @ApiProperty({
        type: 'enum',
        enum: ExperienceType,
        example: ExperienceType.REGARDLESS,
    })
    experienceType: ExperienceType;

    @Expose()
    @ApiProperty({ example: '1000' })
    @IsNotEmpty({ message: 'Number of people recruited is required' })
    @IsNumber()
    numberOfPeople: number;

    @Expose()
    @ApiProperty({ type: 'number' })
    @IsNumber()
    @IsOptional()
    specialNoteId: number;

    @Expose()
    @ApiProperty({ type: 'number' })
    @IsNumber()
    @IsOptional()
    occupationId: number;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @MaxLength(100, { message: 'Post name should be maximum 50 characters' })
    @IsOptional()
    otherInformation: string;

    @Expose()
    @IsEnum(SalaryType)
    @ApiProperty({
        type: 'enum',
        enum: SalaryType,
    })
    @IsOptional()
    salaryType: SalaryType;

    @Expose()
    @ApiProperty({ example: '1000000' })
    @IsNotEmpty({ message: 'Amount of salary is required' })
    @IsNumber()
    @IsOptional()
    salaryAmount: number;

    @Expose()
    @ApiProperty({ example: '2023-12-31' })
    @IsNotEmpty({ message: 'Start working date is required' })
    @IsOptional()
    startWorkDate: string;

    @Expose()
    @ApiProperty({ example: '2023-12-31' })
    @IsNotEmpty({ message: 'End working date is required' })
    @IsOptional()
    endWorkDate: string;

    @Expose()
    @ApiProperty({
        description: 'List of Workday',
        example: ['MONDAY', 'TUESDAY'],
        isArray: true,
        enum: Workday,
    })
    @IsEnum(Workday, { each: true })
    @IsOptional()
    workday: Workday[];

    @Expose()
    @ApiProperty({ example: '09:00:00', format: 'time' })
    @IsNotEmpty({ message: 'Start working time is required' })
    @IsOptional()
    startWorkTime: string;

    @Expose()
    @ApiProperty({ example: '09:00:00', format: 'time' })
    @IsNotEmpty({ message: 'End working time is required' })
    @IsOptional()
    endWorkTime: string;

    @Expose()
    @IsNumber()
    @ApiProperty({ example: 1 })
    @IsOptional()
    siteId: number;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @MaxLength(1000, { message: 'Post name should be maximum 1000 characters' })
    @IsOptional()
    postEditor: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @IsOptional()
    workLocation: string;
}
