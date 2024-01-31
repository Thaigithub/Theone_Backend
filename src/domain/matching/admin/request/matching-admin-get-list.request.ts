import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MatchingAdminGetListCategory } from '../enum/matching-admin-get-list-category.enum';
import { MatchingAdminGetListServiceType } from '../enum/matching-admin-get-list-service-type.enum';

export class MatchingAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(MatchingAdminGetListServiceType)
    @IsOptional()
    serviceType: MatchingAdminGetListServiceType;

    @Expose()
    @IsEnum(MatchingAdminGetListCategory)
    @IsOptional()
    category: MatchingAdminGetListCategory;

    @Expose()
    @IsOptional()
    @IsString()
    keyword: string;

    @Expose()
    @IsOptional()
    @IsString()
    startDate: string;

    @Expose()
    @IsOptional()
    @IsString()
    endDate: string;
}
