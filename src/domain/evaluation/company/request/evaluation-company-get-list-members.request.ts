import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { MemberSearchCategory } from '../dto/evaluation-company-get-list-request.enum';
import { EvaluationCompanyGetListGenericRequest } from './evaluation-company-get-list-generic.request';

export class EvaluationCompanyGetListMembersRequest extends EvaluationCompanyGetListGenericRequest {
    @Expose()
    @IsEnum(MemberSearchCategory)
    @IsOptional()
    searchCategory: MemberSearchCategory;
}
