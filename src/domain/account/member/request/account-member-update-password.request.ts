import { Expose } from 'class-transformer';
import { IsNumber, IsNumberString, IsString, Length } from 'class-validator';

export class AccountMemberUpdatePasswordRequest {
    @Expose()
    @IsString()
    currentPassword: string;

    @Expose()
    @IsString()
    newPassword: string;

    @Expose()
    @IsNumber()
    otpId: number;

    @Expose()
    @IsNumberString()
    @Length(6)
    code: string;
}
