import { ApiProperty } from '@nestjs/swagger';
import { CurrencyExchangeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CurrencyExchangeAdminListResponse {
    @ApiProperty({ type: Number, example: 1 })
    id: number;

    @ApiProperty({ type: Number, example: 1 })
    memberId: number;

    @ApiProperty({ type: 'string', example: 'Dewon' })
    name: string;

    @ApiProperty({ type: 'string', example: '000-0001-0000' })
    contact: string;

    @ApiProperty({ type: Number, example: 100 })
    amount: number;

    @ApiProperty({ type: Number, example: 1 })
    exchangeStatus: CurrencyExchangeStatus;

    @ApiProperty({ type: Date, example: '2023-01-01T00:00:00Z' })
    updatedAt: Date;

    @ApiProperty({ type: 'string', example: 'Kookmin bank' })
    bankName: string;

    @ApiProperty({ type: 'string', example: '000-000-000000' })
    accountNumber: string;
}

export class CurrencyExchangeAdminGetListResponse extends PaginationResponse<CurrencyExchangeAdminListResponse> {}
