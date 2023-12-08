import { ApiProperty } from '@nestjs/swagger';
import { PostCompanyGetItemListResponse } from './post-company-get-item-list.response';

export class PostCompanyGetListResponse {
    @ApiProperty({ type: () => [PostCompanyGetItemListResponse] })
    list: PostCompanyGetItemListResponse[];

    @ApiProperty({
        type: 'number',
        example: 1,
    })
    total: number;

    constructor(list: PostCompanyGetItemListResponse[], total: number) {
        this.list = list;
        this.total = total;
    }
}
