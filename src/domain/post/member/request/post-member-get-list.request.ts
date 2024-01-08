import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class PostMemberGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @ApiProperty({
        type: 'enum',
        enum: PostType,
        required: false,
    })
    @Expose()
    @IsEnum(PostType)
    @IsOptional()
    postType: PostType;

    @ApiProperty({
        type: 'string',
        required: false,
        example: '1,2,3',
    })
    @Expose()
    @IsString()
    @IsOptional()
    occupationList: string[];

    @ApiProperty({
        type: 'string',
        required: false,
        example: '1,2,3',
    })
    @Expose()
    @IsString()
    @IsOptional()
    constructionMachineryList: string[];

    @ApiProperty({
        type: 'string',
        required: false,
        example: 'SHORT,MEDIUM,LONG,REGARDLESS',
    })
    @Expose()
    @IsString()
    @IsOptional()
    experienceTypeList: string[];

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
    regionList: string[];
}
