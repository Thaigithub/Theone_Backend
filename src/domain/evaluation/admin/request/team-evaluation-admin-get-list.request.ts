import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBooleanString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum TeamEvaluationSearchCategory {
    TEAM_NAME = 'TEAM_NAME',
    LEADER_NAME = 'LEADER_NAME',
}

export class TeamEvaluationAdminGetListRequest {
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
