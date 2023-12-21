import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CodeAdminDeleteRequest {
    @Expose()
    @ApiProperty({ example: [1, 2], type: [Number] })
    @Transform(({ value }) => value && value.map(Number))
    ids: number[];
}
