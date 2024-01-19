import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { InterestMemberGetFilter } from '../dto/interest-member-get-filter';

export class InterestMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(InterestMemberGetFilter)
    interestType: InterestMemberGetFilter;
}
