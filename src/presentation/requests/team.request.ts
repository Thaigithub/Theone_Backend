import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export enum SortOptionForSearch {
  HIGHTEST_TEAM_MEMBERS = 'HIGHTEST_TEAM_MEMBERS',
  LOWEST_TEAM_MEMBERS = 'LOWEST_TEAM_MEMBERS',
  DEFAULT = 'DEFAULT',
}

export enum TeamStatusForSearch {
  DEFAULT = 'ALL',
  GENERAL = 'GENERAL',
  STOPPED = 'STOPPED',
  NOT_EXPOSED = 'NOT_EXPOSED',
  WAITING_FOR_ACTIVITY = 'WAITING_FOR_ACTIVITY',
  DELETED = 'DELETED',
}

export enum SearchCategoryForSearch {
  DEFAULT = 'ALL',
  TEAM_CODE = 'TEAM_CODE',
  TEAM_NAME = 'TEAM_NAME',
  TEAM_LEADER = 'TEAM_LEADER',
}

export class TeamSearchRequest {
  @ApiProperty({ example: 'DEFAULT' })
  @IsEnum(SortOptionForSearch)
  @Expose()
  sortOptions: SortOptionForSearch=SortOptionForSearch.DEFAULT;

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

  @ApiProperty({ example:1 })
  @Expose()
  @IsNumber()
  pageNumber:number;

  @ApiProperty({ example: 10})
  @Expose()
  @IsNumber()
  pageSize:number;
}
