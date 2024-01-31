import { MemberLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MemberAdminGetListRecommendationSort } from '../enum/member-admin-get-list-recommendation-sort.enum';
import { MemberAdminGetListCategory } from '../enum/member-admin-get-list-recommendation-approval-category.enum';
export class MemberAdminGetListRecommendationRequest extends PaginationRequest {
    @Expose()
    @IsNumber()
    @Transform(({ value }) => value && parseInt(value))
    requestId: number;

    @Expose()
    @IsEnum(MemberAdminGetListRecommendationSort)
    @IsOptional()
    sortScore: MemberAdminGetListRecommendationSort;

    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    tier: MemberLevel;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(MemberAdminGetListCategory)
    @IsOptional()
    category: MemberAdminGetListCategory;
}
