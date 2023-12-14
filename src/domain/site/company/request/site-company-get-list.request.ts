import { ApiProperty } from '@nestjs/swagger';
import { SiteStatus } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class SiteCompanyGetListRequest {
    @ApiProperty({
        type: 'enum',
        enum: SiteStatus,
    })
    @Expose()
    @IsEnum(SiteStatus)
    @IsOptional()
    status: SiteStatus;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
}
