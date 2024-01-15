import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MatchingMemberGetListCategory } from '../dto/matching-member-get-list-category.enum';

export class MatchingMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(MatchingMemberGetListCategory)
    category: MatchingMemberGetListCategory;
}
