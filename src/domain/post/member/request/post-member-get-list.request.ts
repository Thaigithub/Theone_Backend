import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostMemberGetListRequest {
    @ApiProperty({
        type: 'string',
        required: false,
        example: ['postName', 'siteName'],
    })
    @Expose()
    @IsString()
    @IsIn(['postName', 'siteName'])
    @IsOptional()
    public searchCategory: string;

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
        example: '1,2,3',
    })
    @Expose()
    @IsString()
    @IsOptional()
    public constructionMachineryList: string | number[];

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
