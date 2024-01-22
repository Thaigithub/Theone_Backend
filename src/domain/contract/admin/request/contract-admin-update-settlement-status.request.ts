import { SettlementStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { Equals, IsEnum } from 'class-validator';

export class ContractAdminUpdateSettlementStatusRequest {
    @Expose()
    @IsEnum(SettlementStatus)
    @Equals(SettlementStatus.SETTLED)
    status: SettlementStatus;
}
