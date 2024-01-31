import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SettlementCompanyStatus } from '../enum/settlement-company-status.enum';
import { RequestObject } from '@prisma/client';

export class SettlementCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SettlementCompanyStatus)
    @IsOptional()
    status: SettlementCompanyStatus;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsEnum(RequestObject)
    type: RequestObject;
}
