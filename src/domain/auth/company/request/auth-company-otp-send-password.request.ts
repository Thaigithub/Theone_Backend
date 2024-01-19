import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { AuthCompanyUserIdRequest } from './auth-company-otp-send-username.request';

export class AuthCompanyPasswordRequest extends AuthCompanyUserIdRequest {
    @Expose()
    @IsString()
    username: string;
}
