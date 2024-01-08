import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class EvaluationCompanyCreateEvaluationRequest {
    @ApiProperty({ type: 'number', minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    @Expose()
    score: number;
}
