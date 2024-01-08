import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';

export class PostAdminGetItemListResponse {
    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    type: PostType;

    @ApiProperty({
        type: 'string',
        example: 'Are you looking for a tile worker?',
    })
    name: string;

    @ApiProperty({ type: 'string', example: 'The One' })
    siteName: string;

    @ApiProperty({ type: 'string', example: 'Hong Gil Dong' })
    sitePersonInCharge: string;

    @ApiProperty({ type: 'string', example: '010-7777-7777' })
    siteContact: string;

    @ApiProperty({ type: 'boolean', example: true })
    isHidden: boolean;
}
