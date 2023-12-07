import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AdminCompanyUpdateEmailRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'theone@gmail.com' })
    public email: string;
}
