import { ApiProperty } from '@nestjs/swagger';
import { CodeType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CodeAdminGetItemResponse {
    @IsEnum(CodeType)
    @ApiProperty({
        type: 'enum',
        enum: CodeType,
        example: CodeType.GENERAL,
    })
    codeType: CodeType;

    @IsString()
    @ApiProperty({ example: 'abc' })
    code: string;

    @IsString()
    @ApiProperty({ example: 'abc' })
    codeName: string;
}
