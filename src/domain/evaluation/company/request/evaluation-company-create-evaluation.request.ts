import { Expose } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class EvaluationCompanyCreateEvaluationRequest {
    @IsInt()
    @Min(1)
    @Max(5)
    @Expose()
    score: number;
}
