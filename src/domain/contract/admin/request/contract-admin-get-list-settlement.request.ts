import { RequestObject, SettlementStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class ContractAdminGetListSettlementRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SettlementStatus)
    @IsOptional()
    status: SettlementStatus;

    @Expose()
    @IsEnum(RequestObject)
    @IsOptional()
    type: RequestObject;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    requestDate: string;

    @Expose()
    @IsEnum(RequestObject)
    @IsOptional()
    category: RequestObject;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
