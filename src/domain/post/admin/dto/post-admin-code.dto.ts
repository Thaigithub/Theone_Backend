import { ApiProperty } from '@nestjs/swagger';
import { CodeType } from '@prisma/client';

export class PostAdminCodeDTO {
    @ApiProperty({ example: 'string' })
    code: string;

    @ApiProperty({ example: 'string' })
    codeName: string;

    @ApiProperty({
        type: 'enum',
        enum: CodeType,
        example: CodeType.GENERAL,
    })
    codeType: CodeType;
}
