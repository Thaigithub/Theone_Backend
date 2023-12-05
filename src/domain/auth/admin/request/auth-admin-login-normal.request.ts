import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AuthAdminLoginRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'user@example.com' })
    public username: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'password123456' })
    public password: string;
}
