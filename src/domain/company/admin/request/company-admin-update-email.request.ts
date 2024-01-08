import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AdminCompanyUpdateEmailRequest {
    @Expose()
    @IsString()
    @ApiProperty({ description: 'Company new email', example: 'theone@gmail.com' })
    email: string;
}
