import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MatchingMemberGetListCategory } from '../dto/matching-member-get-list-category.enum';

export class MatchingMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @ApiProperty({
        type: MatchingMemberGetListCategory,
        required: false,
    })
    @IsEnum(MatchingMemberGetListCategory)
    category: MatchingMemberGetListCategory;
}
