import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class ManpowerCompanyGetListMembersRequest {
    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @ApiProperty({
        type: 'string',
        required: false,
        example: '1,2,3',
    })
    @Expose()
    @IsString()
    @IsOptional()
    public occupationList: string | number[];

    @ApiProperty({
        type: 'string',
        required: false,
        example: 'SHORT,MEDIUM,LONG,REGARDLESS',
    })
    @Expose()
    @IsString()
    @IsOptional()
    public experienceTypeList: string | ExperienceType[];

    @ApiProperty({
        type: 'string',
        required: false,
        example: '00-00,00-00,00-00',
    })
    @Expose()
    @IsString()
    @Matches(/^(([0-9]+-[0-9]+)|([0-9]+-[0-9]+,){1,4}([0-9]+-[0-9]+))$/, {
        message: 'The regionList must be in format 00-000 or 00-000,00-000...(5 times)',
    })
    @IsOptional()
    public regionList: string | string[];

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
