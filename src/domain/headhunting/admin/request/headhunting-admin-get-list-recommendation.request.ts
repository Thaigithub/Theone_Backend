import { ApiProperty } from '@nestjs/swagger';
import { MemberLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
    HeadhuntingAdminGetListMemberApprovalCategory,
    HeadhuntingAdminGetListTeamApprovalCategory,
} from '../dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntinAdminGetListRecommendationSort } from '../dto/headhunting-admin-get-list-recommendation-sort.enum';

class HeadhuntingAdminGetListRecommendationRequest {
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

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
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
