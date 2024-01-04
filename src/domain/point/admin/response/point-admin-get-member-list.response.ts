import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class PointAdminResponse {
    @ApiProperty({ type: Number, example: 1 })
    memberId: number;

    @ApiProperty({ type: 'string', example: 'Dewon Kim' })
    name: string;

    @ApiProperty({ type: 'string', example: '000-00000-0000' })
    contact: string;

    @ApiProperty({ type: Number, example: 1 })
    pointHeld: number;

    @ApiProperty({ type: Number, example: 1 })
    totalExchanngePoint: number;
}

export class PointAdminGetMemberListResponse extends PaginationResponse<PointAdminResponse> {}
