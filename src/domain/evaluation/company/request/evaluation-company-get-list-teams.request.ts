import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { TeamSearchCategory } from '../dto/evaluation-company-get-list-request.enum';
import { EvaluationCompanyGetListGenericRequest } from './evaluation-company-get-list-generic.request';

export class EvaluationCompanyGetListTeamsRequest extends EvaluationCompanyGetListGenericRequest {
    @ApiProperty({
        type: 'enum',
        enum: TeamSearchCategory,
        required: false,
    })
    @Expose()
    @IsEnum(TeamSearchCategory)
    @IsOptional()
    searchCategory: TeamSearchCategory;
}
