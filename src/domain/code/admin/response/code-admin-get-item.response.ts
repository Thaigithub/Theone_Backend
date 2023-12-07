import { ApiProperty } from '@nestjs/swagger';
import { CodeType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CodeAdminGetItemResponse {
    @IsEnum(CodeType)
    @ApiProperty({
        type: 'enum',
        enum: CodeType,
        example: CodeType.JOB,
    })
    public codeType: CodeType;

    @IsString()
    @ApiProperty({ example: 'abc' })
    public code: string;

    @IsString()
    @ApiProperty({ example: 'abc' })
    public codeName: string;
}
