import { ApiProperty } from '@nestjs/swagger';
import { CareerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class CareerMemberGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'enum',
        enum: CareerType,
        required: false,
    })
    @Expose()
    @IsEnum(CareerType)
    @IsOptional()
    public type: CareerType;
}
