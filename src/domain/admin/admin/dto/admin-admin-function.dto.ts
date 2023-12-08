import { ApiProperty } from '@nestjs/swagger';

export class FunctionDTO {
    @ApiProperty({ type: 'string' })
    name: string;
}
