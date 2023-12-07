import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { AuthCompanyUserIdRequest } from './auth-company-email-username.request';

export class AuthCompanyUserIdEmailCheckValidRequest extends AuthCompanyUserIdRequest {
    @Expose()
    @ApiProperty({ example: '123456' })
    @IsString()
    @MaxLength(6)
    public code: string;
}
