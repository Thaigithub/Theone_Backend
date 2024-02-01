import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { HeadhuntingAdminGetListRequestCategory } from '../enum/headhunting-admin-get-list-request-category.enum';
import { HeadhuntingAdminGetListRequestStatus } from '../enum/headhunting-admin-get-list-request-status.enum';

export class HeadhuntingAdminGetListRequestRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startRequestDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endRequestDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListRequestCategory)
    @IsOptional()
    category: HeadhuntingAdminGetListRequestCategory;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListRequestStatus)
    @IsOptional()
    status: HeadhuntingAdminGetListRequestStatus;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
