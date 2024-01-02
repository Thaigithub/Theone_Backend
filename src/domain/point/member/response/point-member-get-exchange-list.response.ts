import { ApiProperty } from '@nestjs/swagger';
import { CurrencyExchangeStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointMemberExchangePointResponse {
    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public createdAt: Date;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public updatedAt: Date;

    @ApiProperty({ type: Number, example: 1 })
    public amount: number;

    @ApiProperty({ type: 'enum', enum: CurrencyExchangeStatus, example: true })
    public exchangeStatus: CurrencyExchangeStatus;
}

export class PointMemberGetExchangePointListResponse extends PaginationResponse<PointMemberExchangePointResponse> {}
