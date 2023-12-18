import { ApiProperty } from '@nestjs/swagger';
import { Post, PostType } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export class PostAdminSiteResponse {
    @ApiProperty({ example: 'string' })
    public name: string;

    @ApiProperty({ example: 'string' })
    public contact: string;

    @ApiProperty({ example: 'string' })
    public personInCharge: string;

    @ApiProperty({ example: 'string' })
    public originalBuilding: string;

    @ApiProperty({ type: 'string', example: '101-dong, 42 Seolleung-ro 90-gil, Gangnam-gu, Seoul' })
    public address: string;
}
export class PostAdminResponse {
    @ApiProperty({ type: 'string' })
    name: Post['name'];
    @ApiProperty({ type: 'enum', enum: PostType })
    type: Post['type'];
    @ApiProperty({ type: 'boolean' })
    isHidden: Post['isHidden'];
    @ApiProperty({ type: PostAdminSiteResponse })
    site: PostAdminSiteResponse;
}

export class PostAdminGetListResponse extends PaginationResponse<PostAdminResponse> {}
