import { Expose } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';

export class AccountMemberVerifyOtpVerifyPhoneRequest {
    @Expose()
    @IsNumber()
    otpId: number;

    @Expose()
    @IsString()
    @Length(6)
    code: string;
}
