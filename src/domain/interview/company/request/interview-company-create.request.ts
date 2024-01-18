import { ApplicationCategory } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { InterviewCompanyType } from '../enum/interview-company-type.enum';

export class InterviewCompanyProposeRequest {
    @IsNumber()
    @Expose()
    id: number;

    @IsNumber()
    @Expose()
    postId: number;

    @IsEnum(InterviewCompanyType)
    @Expose()
    interviewProposalType: InterviewCompanyType;

    @IsEnum(ApplicationCategory)
    @Expose()
    category: ApplicationCategory;
}
