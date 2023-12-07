import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { AuthCompanyUserIdRequest } from './auth-company-email-username.request';

export class AuthCompanyPasswordRequest extends AuthCompanyUserIdRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'user1' })
    public username: string;
}
