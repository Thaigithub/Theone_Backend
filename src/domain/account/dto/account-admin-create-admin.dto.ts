import { ApiProperty } from '@nestjs/swagger';

export class AccountAdminCreateAdminDTO {
    @ApiProperty({
        type: 'string',
        examples: ['abc'],
    })
    username: string;
}
