import { RefundStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ProductAdminUpdateRefundStatusRequest {
    @Expose()
    @IsEnum(RefundStatus)
    status: RefundStatus;

    @Expose()
    @IsString()
    @IsOptional()
    updateReason: string;
}
