import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class MemberEvaluationAdminGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'boolean',
        required: false,
    })
    @Expose()
    @IsBooleanString()
    @IsOptional()
    isHighestRating: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
