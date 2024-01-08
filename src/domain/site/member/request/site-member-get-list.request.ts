import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SiteMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        type: 'string',
        example: 'SamSung',
    })
    @Length(1, 50, { message: 'Site name should be maximum 50 characters' })
    name: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    districtId: number;
}
