import { ApiProperty } from '@nestjs/swagger';

export class PointAdminGetDetailResponse {
    @ApiProperty({ type: 'string', example: 'Dewon Kim' })
    name: string;

    @ApiProperty({ type: 'string', example: '010-0000-0000' })
    contact: string;

    @ApiProperty({ type: Number, example: 100 })
    totalPoint: number;

    @ApiProperty({ type: Number, example: 1 })
    totalExchangePoint: number;
}
