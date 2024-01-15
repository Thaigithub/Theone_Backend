import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { EvaluationStatus } from '../dto/evaluation-member-get-list.enum';

export class EvaluationMemberGetListRequest extends PaginationRequest {
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

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    @IsOptional()
    @Expose()
    startWorkDate: string;

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    @IsOptional()
    @Expose()
    endWorkDate: string;
}
