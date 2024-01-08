import { ApiProperty } from '@nestjs/swagger';
import { CurrencyExchangeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointMemberExchangePointResponse {
    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    createdAt: Date;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    updatedAt: Date;

    @ApiProperty({ type: Number, example: 1 })
    amount: number;

    @ApiProperty({ type: 'enum', enum: CurrencyExchangeStatus, example: true })
    exchangeStatus: CurrencyExchangeStatus;
}

export class PointMemberGetExchangePointListResponse extends PaginationResponse<PointMemberExchangePointResponse> {}
