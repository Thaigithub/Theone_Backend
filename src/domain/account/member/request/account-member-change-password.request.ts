import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccountMemberChangePasswordRequest {
    @Expose()
    @IsString()
    currentPassword: string;

    @Expose()
    @IsString()
    newPassword: string;
}
