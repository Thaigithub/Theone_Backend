import { SettlementStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class ContractCompanySettlementUpdateRequest {
    @Expose()
    @IsEnum(SettlementStatus)
    settlementStatus: SettlementStatus;
}
