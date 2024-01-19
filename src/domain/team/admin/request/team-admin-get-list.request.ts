import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SearchCategoryForSearch, SearchSortForSearch, TeamStatusForSearch } from '../dto/team-search';

export class AdminTeamGetListRequest extends PaginationRequest {
    @IsOptional()
    @IsEnum(TeamStatusForSearch)
    @Expose()
    teamStatus: TeamStatusForSearch;

    @IsEnum(SearchCategoryForSearch)
    @Expose()
    @IsOptional()
    searchCategory: SearchCategoryForSearch;

    @IsEnum(SearchSortForSearch)
    @Expose()
    @IsOptional()
    searchSort: SearchSortForSearch;

    @Expose()
    @IsString()
    @IsOptional()
    searchKeyword: string;
}
