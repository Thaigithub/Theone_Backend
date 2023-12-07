import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { AuthMemberPasswordRequest } from './auth-member-sms-password.request';
export class AuthMemberPasswordSmsCheckValidRequest extends AuthMemberPasswordRequest {
    @Expose()
    @ApiProperty({ example: '123456' })
    @IsString()
    @MaxLength(6)
    public code: string;
}
