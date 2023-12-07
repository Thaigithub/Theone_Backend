import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class AuthCompanyUserIdRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'The One' })
    public name: string;
    @Expose()
    @ApiProperty({ example: 'theone@gmail.com' })
    @IsString()
    public email: string;
}
