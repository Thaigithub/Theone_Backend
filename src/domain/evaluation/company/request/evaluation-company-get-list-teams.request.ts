import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { TeamSearchCategory } from '../dto/evaluation-company-get-list-request.enum';
import { EvaluationCompanyGetListGenericRequest } from './evaluation-company-get-list-generic.request';

export class EvaluationCompanyGetListTeamsRequest extends EvaluationCompanyGetListGenericRequest {
    @Expose()
    @IsEnum(TeamSearchCategory)
    @IsOptional()
    searchCategory: TeamSearchCategory;
}
