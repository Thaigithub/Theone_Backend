import { ApiProperty } from '@nestjs/swagger';
import { Admin, AdminLevel } from '@prisma/client';

export class AdminResponse {
    @ApiProperty({ type: 'string' })
    id: Admin['id'];

    @ApiProperty({ type: 'string' })
    name: Admin['name'];

    @ApiProperty({
        type: 'string',
        example: [...Object.values(AdminLevel)],
    })
    level: Admin['level'];
}
