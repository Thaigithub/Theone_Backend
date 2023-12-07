import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { AuthMemberUserIdRequest } from './auth-member-sms-username.request';

export class AuthMemberPasswordRequest extends AuthMemberUserIdRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'user1' })
    public username: string;
}
