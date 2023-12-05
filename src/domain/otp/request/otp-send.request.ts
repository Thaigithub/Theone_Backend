import { OtpType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class OtpSendRequest {
    @Expose()
    @IsNumber()
    public accountId: number;

    @Expose()
    @IsEnum(OtpType)
    public type: OtpType;
}

export class OtpCheckValidRequest extends OtpSendRequest {
    @Expose()
    @IsString()
    public code: string;
}
