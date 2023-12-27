import { ApiProperty } from '@nestjs/swagger';
import { InterviewStatus, Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ApplicationAdminResponse {
    @ApiProperty({ type: 'string', example: 'Gildong Ho...' })
    public name: string;

    @ApiProperty({ type: 'string', example: '010-0000-0000' })
    public contact: string;

    @ApiProperty({ type: Boolean, example: false })
    public isTeam: boolean;

    @ApiProperty({
        type: 'object',
        example: {
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    public city: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({
        type: 'object',
        example: {
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    public district: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({ type: Number, example: 5 })
    public totalExperienceYears: number;

    @ApiProperty({ type: Number, example: 11 })
    public totalExperienceMonths: number;

    @ApiProperty({ type: 'string', example: '140,000 won per day' })
    public desiredSalary: Member['desiredSalary'];

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public assignedAt: Date;

    @ApiProperty({ type: InterviewStatus, example: InterviewStatus.PASS })
    public interviewStatus: InterviewStatus;
}

export class ApplicationAdminGetResponse extends PaginationResponse<ApplicationAdminResponse> {}
