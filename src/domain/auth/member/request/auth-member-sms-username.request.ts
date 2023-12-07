import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class AuthMemberUserIdRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'name' })
    public name: string;
    @Expose()
    @ApiProperty({ example: 'phone number' })
    @IsString()
    public phoneNumber: string;
}
