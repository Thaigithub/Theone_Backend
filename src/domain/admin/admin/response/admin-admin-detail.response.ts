import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@prisma/client';
import { AdminResponse } from './admin-admin.response';

export class AdminDetailResponse extends AdminResponse {
    @ApiProperty({ type: 'string' })
    username: Account['username'];

    @ApiProperty({ type: 'string[]' })
    permissions: string[];
}
