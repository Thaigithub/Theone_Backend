import { RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class LaborCompanyGetListRequest extends PaginationRequest {
    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @IsOptional()
    @Expose()
    @IsEnum(RequestObject)
    type: RequestObject;

    @IsOptional()
    @Expose()
    @IsString()
    keyword: string;
}
