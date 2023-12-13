import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';

export class PostAdminGetItemListResponse {
    @ApiProperty({
        type: 'enum',
        enum: PostType,
        example: PostType.COMMON,
    })
    public type: PostType;

    @ApiProperty({
        type: 'string',
        example: 'Are you looking for a tile worker?',
    })
    public name: string;

    @ApiProperty({ type: 'string', example: 'The One' })
    public siteName: string;

    @ApiProperty({ type: 'string', example: 'Hong Gil Dong' })
    public sitePersonInCharge: string;

    @ApiProperty({ type: 'string', example: '010-7777-7777' })
    public siteContact: string;

    @ApiProperty({ type: 'boolean', example: true })
    public isHidden: boolean;
}
