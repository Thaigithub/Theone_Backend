import { ApiProperty } from '@nestjs/swagger';
import { AdminResponse } from './admin-admin.response';

export class GetAdminListResponse {
    @ApiProperty({ type: () => [AdminResponse] })
    list: AdminResponse[];

    @ApiProperty({
        type: 'number',
        examples: [0, 1, 2],
    })
    total: number;

    constructor(list: AdminResponse[], total: number) {
        this.list = list;
        this.total = total;
    }
}
