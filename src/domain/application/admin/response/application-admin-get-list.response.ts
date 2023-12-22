import { ApiProperty } from '@nestjs/swagger';
import { InterviewStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class ApplicationAdminResponse {
    @ApiProperty({ type: 'string', example: 'Gildong Ho...' })
    public name: string;

    @ApiProperty({ type: 'string', example: '010-0000-0000' })
    public contact: string;

    @ApiProperty({ type: Boolean, example: false })
    public isTeam: boolean;

    @ApiProperty({ type: 'string', example: '404 Building 101, 9, Nambusu...' })
    public region: string;

    @ApiProperty({ type: Number, example: 5 })
    public totalExperienceYears: number;

    @ApiProperty({ type: Number, example: 11 })
    public totalExperienceMonths: number;

    @ApiProperty({ type: 'string', example: '140,000 won per day' })
    public desiredSalary: string;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public assignedAt: Date;

    @ApiProperty({ type: InterviewStatus, example: InterviewStatus.PASS })
    public interviewStatus: InterviewStatus;
}

export class ApplicationAdminGetResponse extends PaginationResponse<ApplicationAdminResponse> {}
