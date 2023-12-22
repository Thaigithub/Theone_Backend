import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class SiteMemberGetListRequest {
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
    @IsOptional()
    @IsString()
    @ApiProperty({
        type: 'string',
        example: 'Seooul',
    })
    addressCity: string;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
}
