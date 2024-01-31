import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class ComapnyAdminGetListProductRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
