import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { HeadhuntingAdminGetListCategory } from '../enum/headhunting-admin-get-list-category.enum';
import { HeadhuntingPaymentStatus } from '@prisma/client';

export class HeadhuntingAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(HeadhuntingPaymentStatus)
    @IsOptional()
    paymentStatus: HeadhuntingPaymentStatus;

    @Expose()
    @IsString()
    @IsOptional()
    paymentDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListCategory)
    @IsOptional()
    category: HeadhuntingAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
