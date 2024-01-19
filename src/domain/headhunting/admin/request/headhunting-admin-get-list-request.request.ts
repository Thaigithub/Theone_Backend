import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { HeadhuntingAdminGetListCategory } from '../dto/headhunting-admin-get-list-category.enum';
import { HeadhuntingAdminGetListRequestStatusEnum } from '../dto/headhunting-admin-get-list-request-status.enum';

export class HeadhuntingAdminGetListRequestRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    startRequestDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endRequestDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListCategory)
    @IsOptional()
    category: HeadhuntingAdminGetListCategory;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListRequestStatusEnum)
    @IsOptional()
    status: HeadhuntingAdminGetListRequestStatusEnum;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
