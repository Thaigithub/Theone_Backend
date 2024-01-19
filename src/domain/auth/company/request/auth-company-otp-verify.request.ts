import { Expose } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class AuthCompanyOtpVerifyRequest {
    @Expose()
    @IsNumber()
    otpId: number;

    @Expose()
    @IsString()
    @MaxLength(6)
    code: string;
}
