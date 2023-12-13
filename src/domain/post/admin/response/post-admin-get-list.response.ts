import { ApiProperty } from '@nestjs/swagger';
import { Post, PostType } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class PostAdminResponse {
    @ApiProperty({ type: 'string' })
    name: Post['name'];
    @ApiProperty({ type: 'enum', enum: PostType })
    type: Post['type'];
    @ApiProperty({ type: 'string' })
    siteName: Post['siteName'];
    @ApiProperty({ type: 'string' })
    sitePersonInCharge: Post['sitePersonInCharge'];
    @ApiProperty({ type: 'string' })
    siteContact: Post['siteContact'];
    @ApiProperty({ type: 'boolean' })
    isHidden: Post['isHidden'];
}

export class PostAdminGetListResponse extends PaginationResponse<PostAdminResponse> {}
