import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

import { MemberLevel } from '@prisma/client';
import { TeamAdminGetListRecommendationCategory } from '../enum/team-admin-get-list-recommendation-category.enum';
import { TeamAdminGetListRecommendationSort } from '../enum/team-admin-get-list-recommendation-sort.enum';
export class TeamAdminGetListRecommendationRequest extends PaginationRequest {
    @Expose()
    @IsNumber()
    @Transform(({ value }) => value && parseInt(value))
    requestId: number;

    @Expose()
    @IsEnum(TeamAdminGetListRecommendationSort)
    @IsOptional()
    sortScore: TeamAdminGetListRecommendationSort;

    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    tier: MemberLevel;

    @Expose()
    @IsEnum(TeamAdminGetListRecommendationCategory)
    @IsOptional()
    category: TeamAdminGetListRecommendationCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
