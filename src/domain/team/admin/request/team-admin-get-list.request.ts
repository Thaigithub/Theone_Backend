import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SearchCategoryForSearch, SearchSortForSearch, TeamStatusForSearch } from '../dto/team-search';

export class AdminTeamGetListRequest extends PaginationRequest {
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

    @ApiProperty({
        type: 'enum',
        enum: SearchSortForSearch,
        required: false,
    })
    @IsEnum(SearchSortForSearch)
    @Expose()
    @IsOptional()
    searchSort: SearchSortForSearch;

    @ApiProperty({ example: 'Team A', required: false })
    @Expose()
    @IsString()
    @IsOptional()
    searchKeyword: string;
}
