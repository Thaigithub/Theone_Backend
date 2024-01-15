import { Expose } from 'class-transformer';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export enum TeamEvaluationSearchCategory {
    TEAM_NAME = 'TEAM_NAME',
    LEADER_NAME = 'LEADER_NAME',
}

export class TeamEvaluationAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsBooleanString()
    @IsOptional()
    isHighestRating: string;

    @Expose()
    @IsEnum(TeamEvaluationSearchCategory)
    @IsOptional()
    searchCategory: TeamEvaluationSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
