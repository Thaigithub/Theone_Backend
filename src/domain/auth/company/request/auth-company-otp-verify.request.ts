import { Expose } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class AuthCompanyOtpVerifyRequest {
    @Expose()
    @IsNumber()
    public otpId: number;

    @Expose()
    @IsString()
    @MaxLength(6)
    public code: string;
}
