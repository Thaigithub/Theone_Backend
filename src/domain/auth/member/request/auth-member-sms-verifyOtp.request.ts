import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

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
