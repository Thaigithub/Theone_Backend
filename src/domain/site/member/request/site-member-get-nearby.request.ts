import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SiteMemberGetNearByRequest extends PaginationRequest {
    @Expose()
    @Transform(({ value }) => value && parseFloat(value))
    @IsNumber()
    longtitude1: number;

    @Expose()
    @Transform(({ value }) => value && parseFloat(value))
    @IsNumber()
    latitude1: number;

    @Expose()
    @Transform(({ value }) => value && parseFloat(value))
    @IsNumber()
    longtitude2: number;

    @Expose()
    @Transform(({ value }) => value && parseFloat(value))
    @IsNumber()
    latitude2: number;

    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @IsNumber()
    numberOfPost: number;
}
