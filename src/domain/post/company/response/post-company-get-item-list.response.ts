import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus, PostType } from '@prisma/client';

export class PostCompanyGetItemListSiteResponse {
    @ApiProperty({ example: 'string' })
    public name: string;
}
export class PostCompanyGetItemListResponse {
    @ApiProperty({ example: 'string' })
    public name: string;

    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    public type: PostType;

    @ApiProperty({
        type: 'enum',
        enum: PostStatus,
        example: PostStatus.PREPARE,
    })
    public status: PostStatus;

    @ApiProperty({
        type: 'Date',
        example: '2023-12-31T23:59:59Z',
    })
    public startDate: Post['startDate'];

    @ApiProperty({
        type: 'Date',
        example: '2023-12-31T23:59:59Z',
    })
    public endDate: Post['endDate'];

    @ApiProperty({ type: PostCompanyGetItemListSiteResponse })
    public site: PostCompanyGetItemListSiteResponse;

    @ApiProperty({ example: 'string' })
    public view: number;
}
