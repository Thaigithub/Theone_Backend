import { PointStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CurrencyExchangeAdminUpdateRequest {
    @Expose()
    @IsEnum(PointStatus)
    @IsOptional()
    status: PointStatus;

    @Expose()
    @IsString()
    @IsOptional()
    reason: string;
}
