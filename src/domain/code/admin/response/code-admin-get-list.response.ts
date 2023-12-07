import { ApiProperty } from '@nestjs/swagger';
import { CodeAdminGetItemResponse } from './code-admin-get-item.response';

export class CodeAdminGetListResponse {
    @ApiProperty({ type: () => [CodeAdminGetItemResponse] })
    list: CodeAdminGetItemResponse[];

    @ApiProperty({
        type: 'number',
        example: 1,
    })
    total: number;

    constructor(list: CodeAdminGetItemResponse[], total: number) {
        this.list = list;
        this.total = total;
    }
}
