import { Expose } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class EvaluationMemberCreateEvaluationRequest {
    @IsInt()
    @Min(1)
    @Max(5)
    @Expose()
    score: number;
}
