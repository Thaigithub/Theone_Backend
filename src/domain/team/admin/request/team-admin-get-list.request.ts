import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { TeamAdminGetListCategory } from '../dto/team-admin-get-list-category.enum';
import { TeamAdminGetListSort } from '../dto/team-admin-get-list-sort.enum';
import { TeamAdminGetListStatus } from '../dto/team-admin-get-list-status.enum';

export class TeamAdminGetListRequest extends PaginationRequest {
    @IsOptional()
    @IsEnum(TeamAdminGetListStatus)
    @Expose()
    teamStatus: TeamAdminGetListStatus;

    @IsEnum(TeamAdminGetListCategory)
    @Expose()
    @IsOptional()
    searchCategory: TeamAdminGetListCategory;

    @IsEnum(TeamAdminGetListSort)
    @Expose()
    @IsOptional()
    searchSort: TeamAdminGetListSort;

    @Expose()
    @IsString()
    @IsOptional()
    searchKeyword: string;
}
