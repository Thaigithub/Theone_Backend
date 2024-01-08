import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { InterestMemberGetFilter } from '../dto/interest-member-get-filter';

export class InterestMemberDeleteRequest {
    @Expose()
    @IsEnum(InterestMemberGetFilter)
    interestType: InterestMemberGetFilter;
}
