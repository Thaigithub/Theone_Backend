import { SettlementStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ParseBoolean } from 'utils/custom-decorators';

import { PaginationRequest } from 'utils/generics/pagination.request';

export class ContractCompanySettlementGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(SettlementStatus)
    @IsOptional()
    settlementStatus: SettlementStatus;

    @Expose()
    @IsString()
    @IsOptional()
    searchTerm: string;

    @Expose()
    @ParseBoolean()
    isTeam: boolean;
}
