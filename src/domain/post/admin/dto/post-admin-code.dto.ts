import { ApiProperty } from '@nestjs/swagger';
import { CodeType } from '@prisma/client';

export class PostAdminCodeDTO {
    @ApiProperty({ example: 'string' })
    public code: string;

    @ApiProperty({ example: 'string' })
    public codeName: string;

    @ApiProperty({
        type: 'enum',
        enum: CodeType,
        example: CodeType.JOB,
    })
    public codeType: CodeType;
}
