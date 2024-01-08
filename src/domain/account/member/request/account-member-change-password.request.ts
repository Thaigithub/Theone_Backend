import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccountMemberChangePasswordRequest {
    @Expose()
    @IsString()
    public currentPassword: string;

    @Expose()
    @IsString()
    public newPassword: string;
}
