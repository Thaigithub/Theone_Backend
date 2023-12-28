import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
export class PaginationRequest {
    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: Number,
        required: false,
    })
    public pageSize: number;

    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: Number,
        required: false,
    })
    public pageNumber: number;
}
