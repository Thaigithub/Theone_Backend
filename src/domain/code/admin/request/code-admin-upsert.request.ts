import { CodeType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CodeAdminUpsertRequest {
    @Expose()
    @IsEnum(CodeType)
    codeType: CodeType;

    @Expose()
    @IsString()
    @Length(1, 10, { message: 'Code should be maximum 10 characters' })
    @IsNotEmpty({ message: 'Code is required' })
    code: string;

    @Expose()
    @IsString()
    @Length(1, 10, { message: 'Code name should be maximum 10 characters' })
    @IsNotEmpty({ message: 'Code name is required' })
    codeName: string;
}
