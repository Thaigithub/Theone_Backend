import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

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
    @IsString()
    @IsOptional()
    @Matches(/^\d+-\d+$/, {
        message: 'Invalid format. Please use the format: "123-456".',
    })
    public regionId: string;

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
