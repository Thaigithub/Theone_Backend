import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export enum InterviewStatus {
    INTERVIEW_PROPOSAL = 'INTERVIEW_PROPOSAL',
    INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
    PASS = 'PASS',
    FAIL = 'FAIL',
    DEADLINE = 'DEADLINE',
}

export class InterviewMemberGetListRequest {
    @IsOptional()
    @IsEnum(InterviewStatus)
    public status: InterviewStatus;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsNumberString()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsNumberString()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'Start date',
        example: '2023-05-10',
    })
    public startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        description: 'End date',
        example: '2023-05-10',
    })
    public endDate: string;
}
