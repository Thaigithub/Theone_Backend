import { Expose } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { EvaluationAdminGetListTeamCategory } from '../enum/evaluation-admin-get-list-team-category.enum';

export class EvaluationAdminGetListTeamRequest extends PaginationRequest {
    @Expose()
    @IsBooleanString()
    @IsOptional()
    isHighestRating: string;

    @Expose()
    @IsEnum(EvaluationAdminGetListTeamCategory)
    @IsOptional()
    searchCategory: EvaluationAdminGetListTeamCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
