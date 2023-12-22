import { ApiProperty } from '@nestjs/swagger';
import { Code } from '@prisma/client';

export class CodeResponse {
    @ApiProperty({ type: 'number' })
    id: Code['id'];

    @ApiProperty({ type: 'string' })
    codeName: Code['codeName'];
}
