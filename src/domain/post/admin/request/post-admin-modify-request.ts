import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Workday } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class PostAdminModifyRequest {
    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    public type: PostType;

    @Expose()
    @IsEnum(PostCategory)
    @ApiProperty({
        type: 'enum',
        enum: PostCategory,
        example: PostCategory.GENERAL,
    })
    @IsOptional()
    public category: PostCategory;

    @Expose()
    @IsEnum(PostStatus)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    @IsOptional()
    public status: PostStatus;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'abc' })
    @Length(1, 50, { message: 'Post name should be maximum 50 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsOptional()
    public name: string;

    @Expose()
    @IsBoolean()
    @ApiProperty({ type: Boolean })
    @IsOptional()
    public isHidden: boolean;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: '101-dong, 42 Seolleung-ro 90-gil, Gangnam-gu, Seoul' })
    @IsNotEmpty({ message: 'Work Location is required' })
    @IsOptional()
    public workLocation: string;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'startDate is required' })
    @IsOptional()
    public startDate: Date;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'endDate is required' })
    @IsOptional()
    public endDate: Date;

    @Expose()
    @IsEnum(ExperienceType)
    @ApiProperty({
        type: 'enum',
        enum: ExperienceType,
        example: ExperienceType.REGARDLESS,
    })
    @IsOptional()
    public experienceType: ExperienceType;

    @Expose()
    @ApiProperty({ type: Number, example: 3 })
    @IsNotEmpty({ message: 'Number of people recruited is required' })
    @IsNumber()
    @IsOptional()
    public numberOfPeople: number;

    @Expose()
    @ApiProperty({ type: Number, example: 1 })
    @IsNumber()
    @IsOptional()
    public specialNoteId: number;

    @Expose()
    @ApiProperty({ type: Number, example: 1 })
    @IsNumber()
    @IsOptional()
    public occupationId: number;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'abc' })
    @MaxLength(100, { message: 'Other information should have maximum 100 characters' })
    @IsOptional()
    public otherInformation: string;

    @Expose()
    @IsEnum(SalaryType)
    @ApiProperty({
        type: 'enum',
        enum: SalaryType,
        example: SalaryType.FIRST_CLASS,
    })
    @IsOptional()
    public salaryType: SalaryType;

    @Expose()
    @ApiProperty({ example: 1000 })
    @IsNotEmpty({ message: 'Amount of salary is required' })
    @IsNumber()
    @IsOptional()
    public salaryAmount: number;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'Start working date is required' })
    @IsOptional()
    public startWorkDate: Date;

    @Expose()
    @ApiProperty({ example: 'YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'Invalid date format' })
    @IsNotEmpty({ message: 'End working date is required' })
    @IsOptional()
    public endWorkDate: Date;

    @Expose()
    @ApiProperty({
        description: 'List of Workday',
        example: ['MONDAY', 'TUESDAY'],
        isArray: true,
        enum: Workday,
    })
    @IsEnum(Workday, { each: true })
    @IsOptional()
    public workday: Workday[];

    @Expose()
    @ApiProperty({ example: '09:00:00', format: 'time' })
    @IsNotEmpty({ message: 'Start working time is required' })
    @IsOptional()
    public startWorkTime: string;

    @Expose()
    @ApiProperty({ example: '18:00:00', format: 'time' })
    @IsNotEmpty({ message: 'End working time is required' })
    @IsOptional()
    public endWorkTime: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Name of Site' })
    @IsOptional()
    public siteName: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Ho Chi Minh city' })
    @IsOptional()
    public siteContact: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Joe Doe' })
    @IsOptional()
    public sitePersonInCharge: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 100, { message: 'Original Building name should be maximum 50 characters' })
    @IsOptional()
    public originalBuilding: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Distric 1, Ho Chi Minh city' })
    @IsOptional()
    public siteAddress: string;

    @Expose()
    @ApiProperty({ type: Number, example: 1 })
    @IsNumber()
    @IsOptional()
    public siteId: number;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'Notice Editor' })
    @MaxLength(1000, { message: 'Post name should be maximum 1000 characters' })
    @IsOptional()
    public postEditor: string;

    @Expose()
    @IsString()
    @ApiProperty({ type: 'string', example: 'Reason to delete notice' })
    @MaxLength(500, { message: 'delete reason should be maximun 500 characters' })
    @IsOptional()
    public deleteReason: string;
}
