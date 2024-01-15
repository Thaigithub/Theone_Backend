import { MemberLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import {
    HeadhuntingAdminGetListMemberApprovalCategory,
    HeadhuntingAdminGetListTeamApprovalCategory,
} from '../dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntinAdminGetListRecommendationSort } from '../dto/headhunting-admin-get-list-recommendation-sort.enum';

class HeadhuntingAdminGetListRecommendationRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value && parseInt(value))
    requestId: number;

    @Expose()
    @IsEnum(HeadhuntinAdminGetListRecommendationSort)
    @IsOptional()
    sortScore: HeadhuntinAdminGetListRecommendationSort;

    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    tier: MemberLevel;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}

export class HeadhuntingAdminGetListMemberRecommendationRequest extends HeadhuntingAdminGetListRecommendationRequest {
    @Expose()
    @IsEnum(HeadhuntingAdminGetListMemberApprovalCategory)
    @IsOptional()
    category: HeadhuntingAdminGetListMemberApprovalCategory;
}

export class HeadhuntingAdminGetListTeamRecommendationRequest extends HeadhuntingAdminGetListRecommendationRequest {
    @Expose()
    @IsEnum(HeadhuntingAdminGetListTeamApprovalCategory)
    @IsOptional()
    category: HeadhuntingAdminGetListTeamApprovalCategory;
}
