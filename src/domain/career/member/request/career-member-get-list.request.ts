import { ApiProperty } from '@nestjs/swagger';
import { CareerType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CareerMemberGetListRequest {
    @ApiProperty({
        type: 'enum',
        enum: CareerType,
        required: false,
    })
    @Expose()
    @IsEnum(CareerType)
    @IsOptional()
    public type: CareerType;

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
