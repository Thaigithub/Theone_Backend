import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SiteMemberGetNearByRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @IsNumber()
    numberOfPost: number;
}
