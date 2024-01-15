import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { EvaluationStatus } from '../dto/evaluation-company-get-list-request.enum';

export class EvaluationCompanyGetListGenericRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(EvaluationStatus)
    @IsOptional()
    status: EvaluationStatus;

    @Expose()
    @IsNumber()
    @Max(5)
    @Min(1)
    @Transform(({ value }) => value && parseInt(value))
    @IsOptional()
    score: number;
}
