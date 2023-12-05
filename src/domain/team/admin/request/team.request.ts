import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SearchCategoryForSearch, SortOptionForSearch, TeamStatusForSearch } from '../dto/team-search';

export class TeamSearchRequest {
    @ApiProperty({
        type: 'enum',
        enum: SortOptionForSearch,
        required: true,
    })
    @IsEnum(SortOptionForSearch)
    @Expose()
    sortOptions: SortOptionForSearch = SortOptionForSearch.DEFAULT;

    @ApiProperty({
        type: 'enum',
        enum: TeamStatusForSearch,
        required: true,
    })
    @IsEnum(TeamStatusForSearch)
    @Expose()
    teamStatus: TeamStatusForSearch;

    @ApiProperty({
        type: 'enum',
        enum: SearchCategoryForSearch,
        required: true,
    })
    @IsEnum(SearchCategoryForSearch)
    @Expose()
    searchCategory: SearchCategoryForSearch;

    @ApiProperty({ example: 'Team A', required: false })
    @Expose()
    @IsString()
    @IsOptional()
    keyWord: string;

    @ApiProperty({
        type: 'number',
        example: 1,
    })
    @Expose()
    pageNumber: number;

    @ApiProperty({
        type: 'number',
        example: 10,
    })
    @Expose()
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
