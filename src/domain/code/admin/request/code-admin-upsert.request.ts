import { ApiProperty } from '@nestjs/swagger';
import { CodeType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CodeAdminUpsertRequest {
    @Expose()
    @IsEnum(CodeType)
    @ApiProperty({
        type: 'enum',
        enum: CodeType,
        example: CodeType.GENERAL,
    })
    public codeType: CodeType;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 10, { message: 'Code should be maximum 10 characters' })
    @IsNotEmpty({ message: 'Code is required' })
    public code: string;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 10, { message: 'Code name should be maximum 10 characters' })
    @IsNotEmpty({ message: 'Code name is required' })
    public codeName: string;
}
