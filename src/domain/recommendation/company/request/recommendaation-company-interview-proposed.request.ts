import { RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class RecommendationCompanyInterviewProposeRequest {
    @Expose()
    object: RequestObject;

    @Expose()
    @IsNumber()
    postId: number;
}
