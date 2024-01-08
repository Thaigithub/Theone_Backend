import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class MemberCompanyManpowerGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

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
    experienceTypeList: string[];

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
    occupationList: string[];

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
    districtList: string[];
}
