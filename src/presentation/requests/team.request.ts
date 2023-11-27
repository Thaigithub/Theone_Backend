import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SearchCategoryForSearch, SortOptionForSearch, TeamStatusForSearch } from 'domain/enums/team-search';

export class TeamSearchRequest {
  @ApiProperty({ example: 'DEFAULT' })
  @IsEnum(SortOptionForSearch)
  @Expose()
  sortOptions: SortOptionForSearch = SortOptionForSearch.DEFAULT;

  @ApiProperty({ example: 'ALL' })
  @IsEnum(TeamStatusForSearch)
  @Expose()
  teamStatus: TeamStatusForSearch;

  @ApiProperty({ example: 'ALL' })
  @IsEnum(SearchCategoryForSearch)
  @Expose()
  searchCategory: SearchCategoryForSearch;

  @ApiProperty({ example: 'Team A' })
  @Expose()
  @IsString()
  keyWord: string;

  @ApiProperty({ example: 1 })
  @Expose()
  @IsNumber()
  pageNumber: number;

  @ApiProperty({ example: 10 })
  @Expose()
  @IsNumber()
  pageSize: number;
}
