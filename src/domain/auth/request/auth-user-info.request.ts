import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UserIdSmsRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'name' })
    public name: string;
    @Expose()
    @ApiProperty({ example: 'phone number' })
    @IsString()
    public phoneNumber: string;
}

export class PasswordSmsRequest extends UserIdSmsRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'user1' })
    public username: string;
}

export class OtpVerificationRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: '012345' })
    public code: string;
    @Expose()
    @IsString()
    @ApiProperty({ example: '0862877320' })
    public phoneNumber: string;
}
