import { BankAccount } from '@prisma/client';

export class AccountMemberGetDetailBankResponse {
    id: BankAccount['id'];
    accountHolder: BankAccount['accountHolder'];
    bankName: BankAccount['bankName'];
    accountNumber: BankAccount['accountNumber'];
}
