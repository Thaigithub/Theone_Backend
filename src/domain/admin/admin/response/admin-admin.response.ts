import { ApiProperty } from '@nestjs/swagger';
import { Admin, AdminLevel } from '@prisma/client';

export class AdminAdminResponse {
    @ApiProperty({ type: 'string' })
    id: Admin['id'];

    @ApiProperty({ type: 'string' })
    name: Admin['name'];

    @ApiProperty({
        type: 'string',
        example: AdminLevel.GENERAL,
    })
    level: Admin['level'];
}
