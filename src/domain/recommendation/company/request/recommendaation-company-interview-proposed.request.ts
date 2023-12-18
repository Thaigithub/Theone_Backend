import { ApiProperty } from '@nestjs/swagger';
import { RequestObject } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class RecommendationCompanyInterviewProposeRequest {
    @Expose()
    @ApiProperty({ type: 'enum', enum: RequestObject, example: RequestObject.INDIVIDUAL })
    public object: RequestObject;

    @Expose()
    @ApiProperty({ type: 'number' })
    @IsNumber()
    public postId: number;
}
