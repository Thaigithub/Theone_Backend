import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AdminCompanyUpdateStatusRequest {
    @Expose()
    @IsString()
    @ApiProperty({ example: 'APPROVED' })
    public status: Account['status'];
}
