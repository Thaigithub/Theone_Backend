import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccountAdminUpdatePasswordRequest {
    @Expose()
    @IsString()
    newPassword: string;
}
