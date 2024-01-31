import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { EvaluationCompanyGetListStatus } from '../enum/evaluation-company-get-list-request.enum';

export class EvaluationCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(EvaluationCompanyGetListStatus)
    @IsOptional()
    status: EvaluationCompanyGetListStatus;

    @Expose()
    @IsNumber()
    @Max(5)
    @Min(1)
    @Transform(({ value }) => value && parseInt(value))
    @IsOptional()
    score: number;
}
