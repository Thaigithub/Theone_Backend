import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointMemberPointResponse {
    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    createdAt: Date;

    @ApiProperty({ type: 'string', example: 'Reason to earn points' })
    reasonEarn: string;

    @ApiProperty({ type: Number, example: 1 })
    amount: number;
}

export class PointMemberGetPointListResponse extends PaginationResponse<PointMemberPointResponse> {}
