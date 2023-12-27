import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { AuthMemberUserIdRequest } from './auth-member-otp-send-username.request';

export class AuthMemberPasswordRequest extends AuthMemberUserIdRequest {
    @Expose()
    @IsString()
    public username: string;
}
