import { Expose } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export enum SiteEvaluationSearchCategory {
    COMPANY_NAME = 'COMPANY_NAME',
    SITE_NAME = 'SITE_NAME',
}

export class SiteEvaluationAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsBooleanString()
    @IsOptional()
    isHighestRating: string;

    @Expose()
    @IsEnum(SiteEvaluationSearchCategory)
    @IsOptional()
    searchCategory: SiteEvaluationSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
