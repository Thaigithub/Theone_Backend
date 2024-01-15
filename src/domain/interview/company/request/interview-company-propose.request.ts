import { Expose } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { InterviewProposalType } from '../dto/interview-company-propose.enum';

export class InterviewCompanyProposeRequest {
    @IsNumber()
    @Expose()
    memberOrTeamId: number;

    @IsNumber()
    @Expose()
    postId: number;

    @IsEnum(InterviewProposalType)
    @Expose()
    interviewProposalType: InterviewProposalType;
}
