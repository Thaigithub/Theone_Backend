import { ApiProperty } from '@nestjs/swagger';
import { RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostCompanyCreateHeadhuntingRequestRequest {
    @Expose()
    @IsEnum(RequestObject)
    @ApiProperty({
        type: 'enum',
        enum: RequestObject,
        example: RequestObject.INDIVIDUAL,
    })
    public object: RequestObject;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @IsOptional()
    public detail: string;

    @Expose()
    @ApiProperty({ type: 'number' })
    @IsNumber()
    public postId: number;
}
