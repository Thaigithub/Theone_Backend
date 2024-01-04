import { BankAccount } from '@prisma/client';

export class AccountMemberGetBankDetailResponse {
    id: BankAccount['id'];
    accountHolder: BankAccount['accountHolder'];
    bankName: BankAccount['bankName'];
    accountNumber: BankAccount['accountNumber'];
}
