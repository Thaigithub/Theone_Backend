import { ApiProperty } from '@nestjs/swagger';

export class PageInfo {
    @ApiProperty({ type: 'number' })
    total: number;
    constructor(total: number) {
        this.total = total;
    }
}

export class PaginationResponse<T> {
    data: T[];
    @ApiProperty({ type: PageInfo })
    pageInfo: PageInfo;
    constructor(item: T[], pageInfo: PageInfo) {
        this.data = item;
        this.pageInfo = pageInfo;
    }
    public static of<T>(pagination: PaginationResponse<T>): PaginationResponse<T> {
        return new PaginationResponse(pagination.data, pagination.pageInfo);
    }
}
