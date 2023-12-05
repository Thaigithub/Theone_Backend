import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
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

export class UserIdSmsCheckValidRequest extends UserIdSmsRequest {
    @Expose()
    @ApiProperty({ example: '123456' })
    @IsString()
    @MaxLength(6)
    public code: string;
}
