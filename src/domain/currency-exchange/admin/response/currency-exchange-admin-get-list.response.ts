import { CurrencyExchangeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CurrencyExchangeAdminListResponse {
    id: number;
    memberId: number;
    name: string;
    contact: string;
    amount: number;
    exchangeStatus: CurrencyExchangeStatus;
    updatedAt: Date;
    bankName: string;
    accountNumber: string;
}

export class CurrencyExchangeAdminGetListResponse extends PaginationResponse<CurrencyExchangeAdminListResponse> {}
