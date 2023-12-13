import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SearchCategoryForSearch, TeamStatusForSearch } from '../dto/team-search';

export class TeamSearchRequest {
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: TeamStatusForSearch,
        required: false,
    })
    @IsEnum(TeamStatusForSearch)
    @Expose()
    teamStatus: TeamStatusForSearch;

    @ApiProperty({
        type: 'enum',
        enum: SearchCategoryForSearch,
        required: false,
    })
    @IsEnum(SearchCategoryForSearch)
    @Expose()
    @IsOptional()
    searchCategory: SearchCategoryForSearch;

    @ApiProperty({ example: 'Team A', required: false })
    @Expose()
    @IsString()
    @IsOptional()
    searchKeyword: string;

    @ApiProperty({
        type: 'number',
        example: 1,
    })
    @Expose()
    @IsOptional()
    pageNumber: number;

    @ApiProperty({
        type: 'number',
        example: 10,
    })
    @Expose()
    @IsOptional()
    pageSize: number;
}

export class DownloadTeamsRequest {
    @Expose()
    @ApiProperty({
        type: 'string',
        example: '[1,2,3]',
        required: true,
    })
    @IsString()
    public teamIds: string;
}
