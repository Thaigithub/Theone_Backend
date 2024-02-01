import { IsEnum } from 'class-validator';
import { InquiryMemberGetCountType } from '../enum/inquiry-member-get-count-type.enum';
import { Expose } from 'class-transformer';

export class InquiryMemberGetCountRequest {
    @IsEnum(InquiryMemberGetCountType)
    @Expose()
    type: InquiryMemberGetCountType;
}
