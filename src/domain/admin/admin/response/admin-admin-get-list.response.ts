import { ApiProperty } from '@nestjs/swagger';
import { AdminAdminResponse } from './admin-admin.response';

export class AdminAdminGetListResponse {
    @ApiProperty({ type: () => [AdminAdminResponse] })
    list: AdminAdminResponse[];

    @ApiProperty({
        type: 'number',
        examples: [0, 1, 2],
    })
    total: number;

    constructor(list: AdminAdminResponse[], total: number) {
        this.list = list;
        this.total = total;
    }
}
