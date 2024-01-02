import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { MatchingMemberGetListCategory } from '../dto/matching-member-get-list-category.enum';

export class MatchingMemberGetListRequest {
    @Expose()
    @IsOptional()
    @ApiProperty({
        type: MatchingMemberGetListCategory,
        required: false,
    })
    @IsEnum(MatchingMemberGetListCategory)
    public category: MatchingMemberGetListCategory;

    @Expose()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
    })
    public pageSize: number;

    @Expose()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
    })
    public pageNumber: number;
}
