import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { AuthCompanyPasswordRequest } from './auth-company-email-password.request';
export class AuthCompanyPasswordEmailCheckValidRequest extends AuthCompanyPasswordRequest {
    @Expose()
    @ApiProperty({ example: '123456' })
    @IsString()
    @MaxLength(6)
    public code: string;
}
