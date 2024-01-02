import { ApiProperty } from '@nestjs/swagger';

export class AdminAdminCreateAdminDTO {
    @ApiProperty({
        type: 'string',
        examples: ['abc'],
    })
    username: string;
}
