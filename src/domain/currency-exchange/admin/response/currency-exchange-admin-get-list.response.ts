import { Bank, BankAccount, CurrencyExchange, Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CurrencyExchangeAdminListResponse {
    id: CurrencyExchange['id'];
    name: Member['name'];
    contact: Member['contact'];
    amount: CurrencyExchange['amount'];
    status: CurrencyExchange['status'];
    completeAt: CurrencyExchange['updatedAt'];
    bankName: Bank['name'];
    accountNumber: BankAccount['accountNumber'];
}

export class CurrencyExchangeAdminGetListResponse extends PaginationResponse<CurrencyExchangeAdminListResponse> {}
