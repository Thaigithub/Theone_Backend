import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { InterviewProposalType } from '../dto/interview-company-propose.enum';

export class InterviewCompanyProposeRequest {
    @ApiProperty({
        type: 'number',
        description: 'memberId or teamId',
    })
    @IsNumber()
    @Expose()
    memberOrTeamId: number;

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
