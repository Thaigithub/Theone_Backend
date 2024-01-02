import { ApiProperty } from '@nestjs/swagger';
import { BankAccount } from '@prisma/client';

export class AccountMemberGetBankDetailResponse {
    @ApiProperty({ type: Number, example: 1 })
    public id: BankAccount['id'];

    @ApiProperty({ type: String, example: 'Dewon Kim' })
    public accountHolder: BankAccount['accountHolder'];

    @ApiProperty({ type: String })
    public bankName: BankAccount['bankName'];

    @ApiProperty({ type: String })
    public accountNumber: BankAccount['accountNumber'];
}
