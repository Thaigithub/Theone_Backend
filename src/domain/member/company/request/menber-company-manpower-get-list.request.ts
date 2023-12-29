import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MemberCompanyManpowerGetListRequest {
    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
        },
        required: false,
        example: 'SHORT,MEDIUM,LONG,REGARDLESS',
    })
    @Expose()
    @IsString()
    @IsOptional()
    public experienceTypeList: string[];

    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
        },
        required: false,
        example: '1,2,3,4,5',
    })
    @Expose()
    @IsString()
    @IsOptional()
    public occupationList: string[];

    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
        },
        required: false,
        example: '1,2,3,4,5',
    })
    @Expose()
    @IsString()
    @IsOptional()
    public regionList: string[];

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
