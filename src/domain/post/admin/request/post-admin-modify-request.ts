import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Workday } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';

export class PostAdminModifyPullUpRequest {
    @Expose()
    @IsBoolean()
    @ApiProperty({ type: Boolean, example: true })
    isPulledUp: boolean;

    @Expose()
    @IsArray()
    @ApiProperty({ type: Array })
    ids: number[];
}

export class PostAdminModifyHiddenRequest {
    @Expose()
    @IsBoolean()
    @ApiProperty({ type: Boolean })
    @IsOptional()
    isHidden: boolean;
}

export class PostAdminModifyPostTypeRequest {
    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.PREMIUM,
    })
    type: PostType;

    @Expose()
    @IsArray()
    @ApiProperty({ type: Array })
    ids: number[];
}

export class PostAdminModifyRequest extends PostAdminModifyPostTypeRequest {
    @Expose()
    @IsEnum(PostCategory)
    @ApiProperty({
        type: 'enum',
        enum: PostCategory,
        example: PostCategory.GENERAL,
    })
    @IsOptional()
    category: PostCategory;

    @Expose()
    @IsEnum(PostStatus)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    @IsOptional()
    status: PostStatus;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'abc' })
    @Length(1, 50, { message: 'Post name should be maximum 50 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsOptional()
    name: string;

    @Expose()
    @IsBoolean()
    @ApiProperty({ type: Boolean })
    @IsOptional()
    isHidden: boolean;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: '101-dong, 42 Seolleung-ro 90-gil, Gangnam-gu, Seoul' })
    @IsNotEmpty({ message: 'Work Location is required' })
    @IsOptional()
    workLocation: string;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'startDate is required' })
    @IsOptional()
    startDate: Date;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'endDate is required' })
    @IsOptional()
    endDate: Date;

    @Expose()
    @IsEnum(ExperienceType)
    @ApiProperty({
        type: 'enum',
        enum: ExperienceType,
        example: ExperienceType.REGARDLESS,
    })
    @IsOptional()
    experienceType: ExperienceType;

    @Expose()
    @ApiProperty({ type: Number, example: 3 })
    @IsNotEmpty({ message: 'Number of people recruited is required' })
    @IsNumber()
    @IsOptional()
    numberOfPeople: number;

    @Expose()
    @ApiProperty({ type: Number, example: 1 })
    @IsNumber()
    @IsOptional()
    specialNoteId: number;

    @Expose()
    @ApiProperty({ type: Number, example: 1 })
    @IsNumber()
    @IsOptional()
    occupationId: number;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'abc' })
    @MaxLength(100, { message: 'Other information should have maximum 100 characters' })
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
    @ApiProperty({ example: 1000 })
    @IsNotEmpty({ message: 'Amount of salary is required' })
    @IsNumber()
    @IsOptional()
    salaryAmount: number;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'Start working date is required' })
    @IsOptional()
    startWorkDate: Date;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'End working date is required' })
    @IsOptional()
    endWorkDate: Date;

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
    @ApiProperty({ example: '18:00:00', format: 'time' })
    @IsNotEmpty({ message: 'End working time is required' })
    @IsOptional()
    endWorkTime: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Name of Site' })
    @IsOptional()
    siteName: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Ho Chi Minh city' })
    @IsOptional()
    siteContact: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Joe Doe' })
    @IsOptional()
    sitePersonInCharge: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 100, { message: 'Original Building name should be maximum 50 characters' })
    @IsOptional()
    originalBuilding: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Distric 1, Ho Chi Minh city' })
    @IsOptional()
    siteAddress: string;

    @Expose()
    @ApiProperty({ type: Number, example: 1 })
    @IsNumber()
    @IsOptional()
    siteId: number;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Notice Editor' })
    @MaxLength(1000, { message: 'Post name should be maximum 1000 characters' })
    @IsOptional()
    postEditor: string;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'Reason to update notice' })
    @MaxLength(500, { message: 'The reason for updating notice should be maximun 500 characters' })
    @IsOptional()
    updateReason: string;
}
