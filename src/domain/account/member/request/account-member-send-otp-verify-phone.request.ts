import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccountMemberSendOtpVerifyPhoneRequest {
    @Expose()
    @IsString()
    phone: string;
}
