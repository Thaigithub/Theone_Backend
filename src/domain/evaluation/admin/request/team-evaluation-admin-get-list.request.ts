import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export enum TeamEvaluationSearchCategory {
    TEAM_NAME = 'TEAM_NAME',
    LEADER_NAME = 'LEADER_NAME',
}

export class TeamEvaluationAdminGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'boolean',
        required: false,
    })
    @Expose()
    @IsBooleanString()
    @IsOptional()
    public isHighestRating: string;

    @ApiProperty({
        type: 'enum',
        enum: TeamEvaluationSearchCategory,
        required: false,
    })
    @Expose()
    @IsEnum(TeamEvaluationSearchCategory)
    @IsOptional()
    public searchCategory: TeamEvaluationSearchCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;
}
