import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';

export class HeadhuntingAdminDenyRequestRequest {
    @Expose()
    @ApiProperty({ example: 'deny reason' })
    @MaxLength(500)
    denyReason: string;
}
