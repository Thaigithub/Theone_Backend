import { PointStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PointAdminUpdateRequest {
    @Expose()
    @IsEnum(PointStatus)
    status: PointStatus;

    @Expose()
    @IsString()
    @IsOptional()
    reason: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    amount: number;
}
