import { ApiProperty } from '@nestjs/swagger';
import { Post, PostStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { PostCompanyGetListHeadhuntingRequestDTO } from '../dto/post-company-get-list-headhunting-request.dto';
import { PostCompanyGetItemListSiteResponse } from './post-company-get-item-list.response';

export class PostCompanyGetItemHeadhuntingRequestResponse {
    @ApiProperty({ example: 'string' })
    public name: string;

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

    @ApiProperty({ type: PostCompanyGetListHeadhuntingRequestDTO })
    public headhuntingRequest: PostCompanyGetListHeadhuntingRequestDTO;
}

export class PostCompanyGetListHeadhuntingRequestResponse extends PaginationResponse<PostCompanyGetItemHeadhuntingRequestResponse> {}
