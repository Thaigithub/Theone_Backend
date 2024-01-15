import { CodeType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CodeAdminGetItemResponse {
    @IsEnum(CodeType)
    codeType: CodeType;

    @IsString()
    code: string;

    @IsString()
    codeName: string;
}
