import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class TeamMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsBoolean()
    @IsOptional()
    isLeader: boolean;
}
