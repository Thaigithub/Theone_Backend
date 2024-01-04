import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointAdminListResponse {
    @ApiProperty({ type: Date, example: '2023-01-01T00:00:00Z' })
    createAt: Date;

    @ApiProperty({ type: 'string', example: 'Dewon Kim' })
    reasonEarn: string;

    @ApiProperty({ type: Number, example: 100 })
    amount: number;

    @ApiProperty({ type: Number, example: 1 })
    remainAmount: number;
}

export class PointAdminGetListResponse extends PaginationResponse<PointAdminListResponse> {}
