import { Expose } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { EvaluationAdmingetListSiteCategory } from '../enum/evaluation-admin-get-list-site-category.enum';

export class EvaluationAdminGetListSiteRequest extends PaginationRequest {
    @Expose()
    @IsBooleanString()
    @IsOptional()
    isHighestRating: string;

    @Expose()
    @IsEnum(EvaluationAdmingetListSiteCategory)
    @IsOptional()
    searchCategory: EvaluationAdmingetListSiteCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
