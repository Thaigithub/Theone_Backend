import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointMemberPointResponse {
    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public createdAt: Date;

    @ApiProperty({ type: 'string', example: 'Reason to earn points' })
    public reasonEarn: string;

    @ApiProperty({ type: Number, example: 1 })
    public amount: number;
}

export class PointMemberGetPointListResponse extends PaginationResponse<PointMemberPointResponse> {}
