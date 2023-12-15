import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType, PostStatus, PostType, SalaryType, Workday } from '@prisma/client';
import { PostAdminCodeDTO } from '../dto/post-admin-code.dto';

export class PostAdminDetailResponse {
    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    public type: PostType;

    @ApiProperty({ type: 'string', example: 'string' })
    public name: string;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    public startDate: Date;

    @ApiProperty({ type: Date, example: '2023-12-31T23:59:59Z' })
    public endDate: Date;

    @ApiProperty({ type: 'string', example: '101-dong, 42 Seolleung-ro 90-gil, Gangnam-gu, Seoul' })
    public siteAddress: string;

    @ApiProperty({ type: 'enum', enum: ExperienceType, example: ExperienceType.MEDIUM })
    public experienceType: ExperienceType;

    @ApiProperty({ type: Number, example: '5' })
    public numberOfPeople: number;

    @ApiProperty({
        type: PostAdminCodeDTO,
    })
    public specialNote: PostAdminCodeDTO;

    @ApiProperty({
        type: PostAdminCodeDTO,
    })
    public occupation: PostAdminCodeDTO;

    @ApiProperty({
        type: 'enum',
        enum: SalaryType,
        example: SalaryType.HOURLY,
    })
    public salaryType: SalaryType;

    @ApiProperty({
        type: Number,
        example: '300',
    })
    public salaryAmount: number;

    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    public status: PostStatus;

    @ApiProperty({
        type: Date,
        example: '2023-06-08',
    })
    public startWorkDate: Date;

    @ApiProperty({
        type: Date,
        example: '2023-10-09',
    })
    public endWorkDate: Date;

    @ApiProperty({
        type: 'enum',
        enum: Workday,
        isArray: true,
        example: [Workday.MONDAY, Workday.TUESDAY, Workday.WEDNESDAY],
    })
    public workday: Workday[];

    @ApiProperty({
        type: Date,
        example: '1970-01-01T08:30:00',
    })
    public startWorkTime: Date;

    @ApiProperty({
        type: Date,
        example: '1970-01-01T17:30:00',
    })
    public endWorkTime: Date;

    @ApiProperty({
        type: 'string',
        example: 'These are the details of the announcement.',
    })
    postEditor: string;

    @ApiProperty({ example: 'string' })
    public siteName: string;

    @ApiProperty({ example: 'string', description: 'Enter on-site contact information' })
    public siteContact: string;

    @ApiProperty({ example: 'string', description: 'Enter the person in charge' })
    public sitePersonInCharge: string;

    @ApiProperty({ example: 'string', description: 'Enter the original building' })
    public originalBuilding: string;
}
