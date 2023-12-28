import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { InterviewProposalType } from '../dto/manpower-company-interview-proposal-type.enum';
import { Expose } from 'class-transformer';

export class ManpowerCompanyProposeInterviewRequest {
    @ApiProperty({
        type: 'number',
        description: 'memberId or teamId',
    })
    @IsNumber()
    @Expose()
    id: number;

    @ApiProperty({
        type: 'number',
    })
    @IsNumber()
    @Expose()
    postId: number;

    @ApiProperty({
        type: 'enum',
        enum: InterviewProposalType,
        description: 'Type: MEMBER or TEAM',
    })
    @IsEnum(InterviewProposalType)
    @Expose()
    interviewProposalType: InterviewProposalType;
}
