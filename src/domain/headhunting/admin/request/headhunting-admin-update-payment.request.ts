import { HeadhuntingPaymentStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, Matches } from 'class-validator';

export class HeadhuntingAdminUpdatePaymentRequest {
    @Expose()
    @IsEnum(HeadhuntingPaymentStatus)
    paymentStatus: HeadhuntingPaymentStatus;

    @Expose()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    paymentDate: string;
}
