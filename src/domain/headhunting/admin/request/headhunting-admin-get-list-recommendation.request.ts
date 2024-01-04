import { ApiProperty } from '@nestjs/swagger';
import { MemberLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
    HeadhuntingAdminGetListMemberApprovalCategory,
    HeadhuntingAdminGetListTeamApprovalCategory,
} from '../dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntinAdminGetListRecommendationSort } from '../dto/headhunting-admin-get-list-recommendation-sort.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

class HeadhuntingAdminGetListRecommendationRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    @Transform(({ value }) => value && parseInt(value))
    public requestId: number;

    @Expose()
    @IsEnum(HeadhuntinAdminGetListRecommendationSort)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntinAdminGetListRecommendationSort,
        required: false,
    })
    public sortScore: HeadhuntinAdminGetListRecommendationSort;

    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: MemberLevel,
        required: false,
    })
    public tier: MemberLevel;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public keyword: string;
}

export class HeadhuntingAdminGetListMemberRecommendationRequest extends HeadhuntingAdminGetListRecommendationRequest {
    @Expose()
    @IsEnum(HeadhuntingAdminGetListMemberApprovalCategory)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListMemberApprovalCategory,
        required: false,
    })
    public category: HeadhuntingAdminGetListMemberApprovalCategory;
}

export class HeadhuntingAdminGetListTeamRecommendationRequest extends HeadhuntingAdminGetListRecommendationRequest {
    @Expose()
    @IsEnum(HeadhuntingAdminGetListTeamApprovalCategory)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListTeamApprovalCategory,
        required: false,
    })
    public category: HeadhuntingAdminGetListTeamApprovalCategory;
}
