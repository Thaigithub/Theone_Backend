import { Optional } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { SettlementAdminAmountStatus } from '../enum/settlement-admin-amount-status.enum';
import { SettlementAdminStageCategory } from '../enum/settlement-admin-stage-category.enum';

export class SettlementAdminAmountRequest {
    @Expose()
    @IsEnum(SettlementAdminStageCategory)
    stage: SettlementAdminStageCategory;

    @Expose()
    @IsEnum(SettlementAdminAmountStatus)
    @Optional()
    status: SettlementAdminAmountStatus;
}
