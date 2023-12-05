import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { UserIdSmsRequest } from './auth-member-sms-username.request';

export class PasswordSmsRequest extends UserIdSmsRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'user1' })
    public username: string;
}

export class PasswordSmsCheckValidRequest extends PasswordSmsRequest {
    @Expose()
    @ApiProperty({ example: '123456' })
    @IsString()
    @MaxLength(6)
    public code: string;
}
