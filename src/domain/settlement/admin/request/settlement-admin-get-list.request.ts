import { RequestObject, SettlementStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SettlementAdminCategory } from '../enum/settlement-admin-category';

export class SettlementAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SettlementStatus)
    @IsOptional()
    status: SettlementStatus;

    @Expose()
    @IsEnum(RequestObject)
    @IsOptional()
    object: RequestObject;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    startDate: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    endDate: string;

    @Expose()
    @IsEnum(SettlementAdminCategory)
    @IsOptional()
    category: SettlementAdminCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
