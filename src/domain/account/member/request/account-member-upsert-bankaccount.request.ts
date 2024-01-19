import { Expose } from 'class-transformer';
import { IsNumberString, IsString } from 'class-validator';

export class AccountMemberUpsertBankAccountRequest {
    @Expose()
    @IsString()
    accountHolder: string;

    @Expose()
    @IsNumberString()
    accountNumber: string;

    @Expose()
    @IsString()
    bankName: string;
}
