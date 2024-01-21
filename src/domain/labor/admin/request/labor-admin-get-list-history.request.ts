import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class LaborAdminGetListHistoryRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    date: string;
}
