import { HeadhuntingPaymentStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { HeadhuntingAdminGetListCategory } from '../enum/headhunting-admin-get-list-category.enum';

export class HeadhuntingAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(HeadhuntingPaymentStatus)
    @IsOptional()
    paymentStatus: HeadhuntingPaymentStatus;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startPaymentDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endPaymentDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListCategory)
    @IsOptional()
    category: HeadhuntingAdminGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
