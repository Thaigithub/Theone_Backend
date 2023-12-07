import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { AuthMemberUserIdRequest } from './auth-member-sms-username.request';

export class AuthMemberUserIdSmsCheckValidRequest extends AuthMemberUserIdRequest {
    @Expose()
    @ApiProperty({ example: '123456' })
    @IsString()
    @MaxLength(6)
    public code: string;
}
