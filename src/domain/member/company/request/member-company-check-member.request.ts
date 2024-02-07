import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class MemberCompanyCheckMemberRequest {
    @Expose()
    @IsNumber()
    productPaymentHistoryId: number;
}
