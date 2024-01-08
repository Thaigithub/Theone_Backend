import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { EvaluationStatus } from '../dto/evaluation-member-get-list.enum';

export class EvaluationMemberGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'string',
        description: 'Search by site name',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @ApiProperty({
        type: 'enum',
        enum: EvaluationStatus,
        required: false,
    })
    @Expose()
    @IsEnum(EvaluationStatus)
    @IsOptional()
    status: EvaluationStatus;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @Max(5)
    @Min(1)
    @Transform(({ value }) => value && parseInt(value))
    @IsOptional()
    score: number;

    @ApiProperty({
        type: 'string',
        format: 'date',
        required: false,
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    @IsOptional()
    @Expose()
    startWorkDate: string;

    @ApiProperty({
        type: 'string',
        format: 'date',
        required: false,
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    @IsOptional()
    @Expose()
    endWorkDate: string;
}
