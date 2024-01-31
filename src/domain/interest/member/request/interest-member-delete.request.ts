import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { InterestMemberGetListCategory } from '../enum/interest-member-get-filter';

export class InterestMemberDeleteRequest {
    @Expose()
    @IsEnum(InterestMemberGetListCategory)
    interestType: InterestMemberGetListCategory;
}
