import { ApiProperty } from '@nestjs/swagger';
import { RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PostCompanyCreateHeadhuntingRequestRequest {
    @Expose()
    @IsEnum(RequestObject)
    @ApiProperty({
        type: 'enum',
        enum: RequestObject,
        example: RequestObject.INDIVIDUAL,
    })
    object: RequestObject;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @IsOptional()
    detail: string;
}
