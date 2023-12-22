import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ApplicationAdminGetListRequest {
    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: 'number',
        required: false,
    })
    public pageSize: number;

    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    @ApiProperty({
        type: 'number',
        required: false,
    })
    public pageNumber: number;
}
