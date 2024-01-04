import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export enum InterviewStatus {
    INTERVIEW_PROPOSAL = 'INTERVIEW_PROPOSAL',
    INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
    PASS = 'PASS',
    FAIL = 'FAIL',
    DEADLINE = 'DEADLINE',
}

export class InterviewMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(InterviewStatus)
    public status: InterviewStatus;

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
