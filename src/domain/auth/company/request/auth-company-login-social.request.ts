import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class AuthCompanyLoginSocialRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'asdfgasdgads' })
    public idToken: string;
}

export class ChangePasswordRequest {
    @Expose()
    @IsString()
    @Length(8)
    @ApiProperty({ example: 'password123456' })
    public newPassword: string;
}
