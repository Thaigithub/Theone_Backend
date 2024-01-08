import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus, PostType } from '@prisma/client';

export class PostCompanyGetItemListSiteResponse {
    @ApiProperty({ example: 'string' })
    name: string;
}
export class PostCompanyGetItemListResponse {
    @ApiProperty({ example: 'string' })
    name: string;

    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    type: PostType;

    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    status: PostStatus;

    @ApiProperty({
        type: 'Date',
        example: '2023-12-31T23:59:59Z',
    })
    startDate: Post['startDate'];

    @ApiProperty({
        type: 'Date',
        example: '2023-12-31T23:59:59Z',
    })
    endDate: Post['endDate'];

    @ApiProperty({ type: PostCompanyGetItemListSiteResponse })
    site: PostCompanyGetItemListSiteResponse;

    @ApiProperty({ example: 'string' })
    view: number;
}
